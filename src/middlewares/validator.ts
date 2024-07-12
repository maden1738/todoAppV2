import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { BadRequestError } from "../errors/BadRequestError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("ValidatorLogger");

export function validateReqBody(schema: Schema) {
     return (req: Request, res: Response, next: NextFunction) => {
          logger.info("validateReqBody");
          const { error, value } = schema.validate(req.body);

          if (error) {
               next(new BadRequestError(error.message));
               return;
          }

          req.body = value;

          next();
     };
}

export function validateReqQuery(schema: Schema) {
     return (req: Request, res: Response, next: NextFunction) => {
          logger.info("validateReqQuery");
          const { error, value } = schema.validate(req.query);

          if (error) {
               next(new BadRequestError(error.message));
               return;
          }

          req.query = value;

          next();
     };
}
