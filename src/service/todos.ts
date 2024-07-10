import { Todo } from "../interface/todos";
import * as TodosModel from "../model/todos";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("TodosServices");

export function getTodos(userId: string) {
     logger.info("getTodos");

     const data = TodosModel.getTodos(userId);
     return data;
}

export function getTodoById(id: string, userId: string) {
     logger.info("getTodosById");
     const data = TodosModel.getTodoById(id, userId);
     if (data) {
          return data;
     }
}

export function createTodos(body: Todo, userId: string) {
     logger.info("createTodos");
     return TodosModel.createTodos(body, userId);
}

export function updateTodo(id: string, body: Todo, userId: string) {
     logger.info("updateTodo");
     const data = TodosModel.getTodoById(id, userId);
     if (data) {
          return TodosModel.updateTodo(id, body);
     }
}

export function deleteTodo(id: string, userId: string) {
     logger.info("deleteTodo");
     const data = TodosModel.getTodoById(id, userId);
     if (!data) {
          return null;
     }
     TodosModel.deleteTodo(id);
}
