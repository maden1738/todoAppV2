import { NextFunction, Response, Request } from "express";
import { IRequest } from "../interface/auth";
import * as UserService from "../service/user";
import HttpStatusCode from "http-status-codes";
import { BadRequestError } from "../errors/BadRequestError";
import { GetUserQuery } from "../interface/user";

export function getUser(
     req: Request<any, any, any, GetUserQuery>,
     res: Response
) {
     const { query } = req;
     const data = UserService.getUser(query);
     res.status(HttpStatusCode.OK).json(data);
}

export function getUserById(req: Request, res: Response, next: NextFunction) {
     const { id } = req.params;

     const data = UserService.getUserById(id);

     if (!data) {
          next(new BadRequestError(`User with id: ${id} not found`));
     }

     res.status(HttpStatusCode.OK).json(data);
}

export async function createUser(
     req: IRequest,
     res: Response,
     next: NextFunction
) {
     const { body } = req;
     const data = await UserService.createUser(body, req.user.id);

     if (!data) {
          next(new BadRequestError("User with that email already exists"));
          return;
     }

     res.status(HttpStatusCode.CREATED).json({
          message: "User created Successfully",
          data,
     });
}

export async function updateUser(
     req: IRequest,
     res: Response,
     next: NextFunction
) {
     const { body } = req;
     const { id } = req.params;

     const data = await UserService.updateUser(id, body);

     if (!data) {
          next(new BadRequestError(`User with id: ${id} not found`));
          return;
     }

     res.status(HttpStatusCode.OK).json(data);
}

export function deleteUser(req: Request, res: Response, next: NextFunction) {
     const { id } = req.params;

     const data = UserService.deleteUser(id);

     if (data === null) {
          next(new BadRequestError(`User with id: ${id} not found`));
          return;
     }

     res.status(HttpStatusCode.OK).json({
          message: `User with id: ${id} deleted`,
     });
}
