import { ZodError } from "zod";
import { BadRequestsException } from "./exceptions/bad-requests";
import { InternalException } from "./exceptions/internal-exception";
import { ErrorCode, HttpException } from "./exceptions/root";
import { Response, Request, NextFunction } from "express";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestsException(
            "Unprocessable entity.",
            ErrorCode.UNPROCESSABLE_ENTITY
          );
        } else {
          exception = new InternalException(
            "Something went wrong!",
            error,
            ErrorCode.INTERNAL_EXCEPTION
          );
        }
      }
      next(exception);
    }
  };
};
