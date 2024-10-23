import { prismaClient } from "..";
import { Request, Response } from "express";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const createOrder = async (req: Request, res: Response) => {
  // 1. to create a transaction
  // 2. to list all the cart items and proceed if cart is not empty
  // 3. calculate the total amount
  // 4. fetch address of user
  // 5. to define computed field for formatted adress on address model
  // 6. we will create a order and order products
  // 7. create the event
  //   8. empty the cart
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length == 0) {
      return res.json({ message: "cart is empty" });
    }

    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);

    const address = await tx.address.findFirst({
      where: {
        id: req.user.defaultShippingAddress!,
      },
    });

    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address!.formattedAddress,
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });

    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        userId: req.user.id,
      },
    });

    return res.json(order);
  });
};

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });

  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  const orderExists = await prismaClient.order.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!orderExists) {
    throw new NotFoundException("oRDER doesnt exists", 404);
  }

  // Start the transaction
  // Find the order and ensure it exists
  const { userId } = await prismaClient.order.findFirstOrThrow({
    where: {
      id: Number(req.params.id),
    },
  });

  // Ensure the user is canceling their own order

  if (req.user.id !== userId) {
    throw new UnauthorizedException(
      "ORDER item does not belong to you",
      ErrorCode.UNAUTHORZED_EXCEPTION
    );
  }

  const order = await prismaClient.$transaction(async (tx) => {
    // Update order status to 'CANCELLED'
    const updatedOrder = await tx.order.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: "CANCELLED",
      },
    });

    // Log the order event
    await tx.orderEvent.create({
      data: {
        orderId: updatedOrder.id,
        status: "CANCELLED",
      },
    });

    // Return the updated order
    return updatedOrder;
  });

  res.json(order);
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        products: true,
        events: true,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

// admin

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};
  const status = req.query.status;
  if (status) {
    whereClause = {
      status,
    };
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: Number(req.query.skip) || 0,
  });

  res.json(orders);
};

export const changeStatus = async (req: Request, res: Response) => {
  // wrap it inside transaction
  try {
    const order = await prismaClient.order.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: req.body.status,
      },
    });

    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: req.body.status,
      },
    });

    res.json(order);
  } catch (err) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listUserOrders = async (req: Request, res: Response) => {
  let whereClause: any = {
    userId: Number(req.params.id),
  };
  const status = req.query.status;
  if (status) {
    whereClause = {
      ...whereClause,
      status
    };
  }

  console.log(whereClause)

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: Number(req.query.skip) || 0,
    take: 5
  })

  res.json(orders)
};
