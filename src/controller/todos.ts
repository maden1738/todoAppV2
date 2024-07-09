import { Request, Response } from "express";
import * as TodosService from "../service/todos";
import { decodeJwt } from "../utils/decodeJwt";

export function getTodo(req: Request, res: Response) {
     const decoded = decodeJwt(req);
     const data = TodosService.getTodos(decoded["id"]);
     res.json({ data });
}

export function getTodoById(req: Request, res: Response) {
     const decoded = decodeJwt(req);
     const { id } = req.params;
     const data = TodosService.getTodoById(id, decoded["id"]);
     res.json(data);
}

export function createTodos(req: Request, res: Response) {
     const decoded = decodeJwt(req);
     const { body } = req;
     const data = TodosService.createTodos(body, decoded["id"]);
     res.json({
          message: "Todos Created",
          data,
     });
}

export function updateTodo(req: Request, res: Response) {
     const decoded = decodeJwt(req);
     const { id } = req.params;
     const { body } = req;
     const data = TodosService.updateTodo(id, body, decoded["id"]);
     res.json(data);
}

export function deleteTodo(req: Request, res: Response) {
     const decoded = decodeJwt(req);
     const { id } = req.params;
     const error = TodosService.deleteTodo(id, decoded["id"]);
     if (error) {
          return res.status(404).json(error);
     }
     res.json({ message: `Todo with id: ${id} deleted` });
}
