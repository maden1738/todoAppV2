import { NextFunction, Response } from "express";
import { IRequest } from "../interface/auth";
import * as TodosService from "../service/todos";
import { BadRequestError } from "../errors/BadRequestError";
import HttpStatusCode from "http-status-codes";

export async function getTodo(req: IRequest, res: Response) {
     const userId = req.user?.id!;
     const data = await TodosService.getTodos(userId);

     res.status(HttpStatusCode.OK).json({ data });
}

export async function getTodoById(
     req: IRequest,
     res: Response,
     next: NextFunction
) {
     const userId = req.user?.id!;
     const { id } = req.params;

     const data = await TodosService.getTodoById(id, userId);
     if (!data) {
          next(new BadRequestError(`Todo with id: ${id} doesnt exist`));
          return;
     }

     res.status(HttpStatusCode.OK).json(data);
}

export async function createTodos(req: IRequest, res: Response) {
     const userId = req.user?.id!;
     const { body } = req;

     const data = await TodosService.createTodos(body, userId);

     res.status(HttpStatusCode.CREATED).json({
          message: "Todos Created",
          data,
     });
}

export async function updateTodo(
     req: IRequest,
     res: Response,
     next: NextFunction
) {
     const userId = req.user?.id!;
     const { id } = req.params;
     const { body } = req;

     const data = await TodosService.updateTodo(id, body, userId);

     if (!data) {
          next(new BadRequestError(`Todo with id: ${id} doesnt exist`));
          return;
     }

     res.status(HttpStatusCode.OK).json(data);
}

export async function deleteTodo(
     req: IRequest,
     res: Response,
     next: NextFunction
) {
     const userId = req.user?.id!;
     const { id } = req.params;

     const data = await TodosService.deleteTodo(id, userId);

     if (data === null) {
          next(new BadRequestError(`Todo with id: ${id} doesnt exist`));
          return;
     }
     res.status(HttpStatusCode.OK).json({
          message: `Todo with id: ${id} deleted`,
     });
}
