import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../exceptions/root";
import { JWT_SECRET } from "../secrets";
import * as jwt from "jsonwebtoken";
import { prismaClient } from "..";
import { UnauthorizedException } from "../exceptions/unauthorized";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //1. extract the token from header
  const token = req.headers.authorization;
  //2. if token is not present, throw an error of unauthorized
  if (!token) {
    next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORZED_EXCEPTION)
    );
  }
  console.log("middleware called");
  console.log(token);

  try {
    //3. if token is present, verify that token and extract the payload
    const payload = jwt.verify(token!, JWT_SECRET) as { userId: string };
    //4. to get the user from the payload
    const user = await prismaClient.user.findFirst({
      where: { id: Number(payload.userId) },
    });
    if (!user) {
      next(
        new UnauthorizedException(
          "Unauthorized",
          ErrorCode.UNAUTHORZED_EXCEPTION
        )
      );
      return;
    }
    //5. to attach the user to the current request object
    req.user = user;
    next();
  } catch (error) {
    next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORZED_EXCEPTION)
    );
  }
};

export default authMiddleware;
