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
