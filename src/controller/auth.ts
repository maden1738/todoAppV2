import { NextFunction, Request, Response } from "express";
import * as AuthService from "../service/auth";
import HttpStatusCode from "http-status-codes";
import { nextTick } from "process";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";

export async function signup(req: Request, res: Response) {
     const { body } = req;

     await AuthService.signup(body);

     res.status(HttpStatusCode.CREATED).json({
          message: "user created successfully",
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
