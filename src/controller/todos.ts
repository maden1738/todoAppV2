import { NextFunction, Response } from "express";
import { Request } from "../interface/auth";
import * as TodosService from "../service/todos";
import { BadRequestError } from "../errors/BadRequestError";

export function getTodo(req: Request, res: Response) {
     const userId = req.user?.id!;
     const data = TodosService.getTodos(userId);

     res.json({ data });
}

export function getTodoById(req: Request, res: Response, next: NextFunction) {
     const userId = req.user?.id!;
     const { id } = req.params;
     const data = TodosService.getTodoById(id, userId);

     if (!data) {
          next(new BadRequestError(`Todo with id: ${id} doesnt exist`));
          return;
     }

     res.json(data);
}

export function createTodos(req: Request, res: Response) {
     const userId = req.user?.id!;
     const { body } = req;
     const data = TodosService.createTodos(body, userId);
     res.json({
          message: "Todos Created",
          data,
     });
}

export function updateTodo(req: Request, res: Response, next: NextFunction) {
     const userId = req.user?.id!;
     const { id } = req.params;
     const { body } = req;
     const data = TodosService.updateTodo(id, body, userId);

     if (!data) {
          next(new BadRequestError(`Todo with id: ${id} doesnt exist`));
          return;
     }

     res.json(data);
}

export function deleteTodo(req: Request, res: Response, next: NextFunction) {
     const userId = req.user?.id!;
     const { id } = req.params;

     const data = TodosService.deleteTodo(id, userId);

     if (data === null) {
          next(new BadRequestError(`Todo with id: ${id} doesnt exist`));
          return;
     }
     res.json({ message: `Todo with id: ${id} deleted` });
}
