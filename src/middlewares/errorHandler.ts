import { NextFunction, Response } from "express";
import { Request } from "express";
import HttpStatusCodes from "http-status-codes";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";

export function notFoundError(req: Request, res: Response) {
     return res.status(HttpStatusCodes.NOT_FOUND).json({
          message: "Not found error",
     });
}

export function genericErrorHandler(
     error: Error,
     req: Request,
     res: Response,
     next: NextFunction
) {
     if (error instanceof UnauthenticatedError) {
          return res.status(HttpStatusCodes.UNAUTHORIZED).json({
               message: error.message,
          });
     } else if (error instanceof BadRequestError) {
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
               message: error.message,
          });
     } else if (error instanceof ForbiddenError) {
          return res.status(HttpStatusCodes.FORBIDDEN).json({
               message: error.message,
          });
     }

     return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Internal server error",
     });
}
