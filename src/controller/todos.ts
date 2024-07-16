import { NextFunction, Response } from "express";
import { IRequest } from "../interface/auth";
import * as TodosService from "../service/todos";
import { BadRequestError } from "../errors/BadRequestError";
import HttpStatusCode from "http-status-codes";

export function getTodo(req: IRequest, res: Response) {
     const userId = req.user?.id!;
     const data = TodosService.getTodos(userId);

     res.status(HttpStatusCode.OK).json({ data });
}

export function getTodoById(req: IRequest, res: Response, next: NextFunction) {
     const userId = req.user?.id!;
     const { id } = req.params;

     const data = TodosService.getTodoById(id, userId);
     if (!data) {
          next(new BadRequestError(`Todo with id: ${id} doesnt exist`));
          return;
     }

     res.status(HttpStatusCode.OK).json(data);
}

export function createTodos(req: IRequest, res: Response) {
     const userId = req.user?.id!;
     const { body } = req;

     const data = TodosService.createTodos(body, userId);

     res.status(HttpStatusCode.CREATED).json({
          message: "Todos Created",
          data,
     });
}

export function updateTodo(req: IRequest, res: Response, next: NextFunction) {
     const userId = req.user?.id!;
     const { id } = req.params;
     const { body } = req;

     const data = TodosService.updateTodo(id, body, userId);

     if (!data) {
          next(new BadRequestError(`Todo with id: ${id} doesnt exist`));
          return;
     }

     res.status(HttpStatusCode.OK).json(data);
}

export function deleteTodo(req: IRequest, res: Response, next: NextFunction) {
     const userId = req.user?.id!;
     const { id } = req.params;

     const data = TodosService.deleteTodo(id, userId);

     if (data === null) {
          next(new BadRequestError(`Todo with id: ${id} doesnt exist`));
          return;
     }
     res.status(HttpStatusCode.OK).json({
          message: `Todo with id: ${id} deleted`,
     });
}
