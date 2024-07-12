import { NextFunction, Request, Response } from "express";
import * as AuthService from "../service/auth";
import HttpStatusCode from "http-status-codes";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";
import { BadRequestError } from "../errors/BadRequestError";

export async function signup(req: Request, res: Response, next: NextFunction) {
     const { body } = req;

     const data = await AuthService.signup(body);

     if (!data) {
          next(new BadRequestError("User with that email already exists"));
          return;
     }

     res.status(HttpStatusCode.CREATED).json({
          message: "user created successfully",
          data,
     });
}

export async function login(req: Request, res: Response, next: NextFunction) {
     const { body } = req;

     const data = await AuthService.login(body);

     if (!data) {
          next(new UnauthenticatedError("Invalid Email or Password"));
          return;
     }

     return res.status(HttpStatusCode.OK).json(data);
}

export function refresh(req: Request, res: Response, next: NextFunction) {
     const { body } = req;

     const data = AuthService.refresh(body);

     if (!data) {
          next(new UnauthenticatedError("Unauthenticated"));
          return;
     }

     res.status(HttpStatusCode.OK).json(data);
}
