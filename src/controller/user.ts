import { NextFunction, Request, Response } from "express";
import * as UserService from "../service/user";
import HttpStatusCode from "http-status-codes";
import { BadRequestError } from "../errors/BadRequestError";
import { nextTick } from "process";

export function getUser(req: Request, res: Response) {
     const data = UserService.getUser();
     res.json(data);
}

export function getUserById(req: Request, res: Response, next: NextFunction) {
     const { id } = req.params;

     const data = UserService.getUserById(id);

     if (!data) {
          next(new BadRequestError(`User with id: ${id} not found`));
     }

     res.json(data);
}

export function createUser(req: Request, res: Response) {
     const { body } = req;

     UserService.createUser(body);
}

export function updateUser(req: Request, res: Response, next: NextFunction) {
     const { body } = req;
     const { id } = req.params;

     const data = UserService.updateUser(id, body);

     if (!data) {
          next(new BadRequestError(`User with id: ${id} not found`));
     }

     res.status(HttpStatusCode.ACCEPTED).json(data);
}

export function deleteUser(req: Request, res: Response, next: NextFunction) {
     const { id } = req.params;

     const data = UserService.deleteUser(id);

     if (data === null) {
          next(new BadRequestError(`User with id: ${id} not found`));
     }

     res.status(HttpStatusCode.ACCEPTED).json({
          message: `User with id: ${id} deleted`,
     });
}
