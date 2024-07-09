import { Request, Response } from "express";
import * as TodosService from "../service/todos";

export function getTodo(req: Request, res: Response) {
     const data = TodosService.getTodos();
     res.json({ data });
}

export function getTodoById(req: Request, res: Response) {
     const { id } = req.params;
     const data = TodosService.getTodoById(id);
     res.json(data);
}

export function createTodos(req: Request, res: Response) {
     const { body } = req;
     const data = TodosService.createTodos(body);
     res.json({
          message: "Todos Created",
          data,
     });
}

export function updateTodo(req: Request, res: Response) {
     const { id } = req.params;
     const { body } = req;
     const data = TodosService.updateTodo(id, body);
     res.json(data);
}

export function deleteTodo(req: Request, res: Response) {
     const { id } = req.params;
     const error = TodosService.deleteTodo(id);
     if (error) {
          return res.status(404).json(error);
     }
     res.json({ message: `Todo with id: ${id} deleted` });
}
