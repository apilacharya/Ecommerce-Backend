import { ErrorCode } from "./../exceptions/root";
import { Request, Response } from "express";
import { changeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { CartItem, Product } from "@prisma/client";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const addItemToCart = async (req: Request, res: Response) => {
  // Check for the existence of the same product in user's cart and alter the quantity as required
  const validatedData = CreateCartSchema.parse(req.body);
  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (err) {
    throw new NotFoundException(
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  const cart = await prismaClient.cartItem.create({
    data: {
      userId: req.user.id,
      productId: product.id,
      quantity: validatedData.quantity,
    },
  });

  res.json(cart);
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  let item;
  item = await prismaClient.cartItem.findFirstOrThrow({
    where: {
      id: +req.params.id,
    },
  });

  if (item.userId !== req.user.id) {
    throw new UnauthorizedException(
      "Cart Item not permitted to delete",
      ErrorCode.UNAUTHORZED_EXCEPTION
    );
  }

  await prismaClient.cartItem.delete({
    where: {
      id: +req.params.id,
    },
  });

  res.json({ success: true });
};

export const changeQuantity = async (req: Request, res: Response) => {
  const validatedData = changeQuantitySchema.parse(req.body);
  let item;
  item = await prismaClient.cartItem.findFirstOrThrow({
    where: {
      id: +req.params.id,
    },
  });

  if (item.userId !== req.user.id) {
    throw new UnauthorizedException(
      "Cart Item does not belong to you",
      ErrorCode.UNAUTHORZED_EXCEPTION
    );
  }

  const updatedCart = await prismaClient.cartItem.update({
    where: {
      id: +req.params.id,
    },
    data: {
      quantity: validatedData.quantity,
    },
  });

  res.json(updatedCart);
};

export const getCart = async (req: Request, res: Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: {
      userId: req.user.id
    },
    include: {
      product: true
    }
  })

  res.json(cart)
};
