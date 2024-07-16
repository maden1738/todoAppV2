import { NextFunction, Response } from "express";
import { IRequest } from "../interface/auth";
import { verify } from "jsonwebtoken";
import config from "../config";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { User } from "../interface/user";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("AuthMiddleware");

export function authenticate(req: IRequest, res: Response, next: NextFunction) {
     const { authorization } = req.headers;

     if (!authorization) {
          next(new UnauthenticatedError("Bearer Token not found"));
          return;
     }

     const token = authorization.split(" ");

     if (token.length !== 2 || token[0] !== "Bearer") {
          next(new UnauthenticatedError("Bearer Token invalid format"));
          return;
     }

     try {
          const decoded = verify(token[1], config.jwt.secret!) as User;
          req.user = decoded;
     } catch (error) {
          next(new UnauthenticatedError("Unauthenticated"));
          return;
     }

     logger.info("user authenticated");
     next();
}

export function authorize(permission: string) {
     return (req: IRequest, res: Response, next: NextFunction) => {
          const user = req.user!;

          if (user.permission == permission) {
               next(new ForbiddenError("Forbidden Request"));
          }
          logger.info("user authorized");
          next();
     };
}
