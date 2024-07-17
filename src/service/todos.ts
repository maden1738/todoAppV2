import { Todo } from "../interface/todos";
import { TodosModel } from "../model/todos";
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

export async function createTodos(body: Todo, userId: string) {
     logger.info("createTodos");
     return await TodosModel.create(body, userId);
}

export async function updateTodo(id: string, body: Todo, userId: string) {
     logger.info("updateTodo");
     const data = TodosModel.getTodoById(id, userId);
     if (data) {
          return await TodosModel.update(id, body);
     }
}

export async function deleteTodo(id: string, userId: string) {
     logger.info("deleteTodo");
     const data = await TodosModel.getTodoById(id, userId);
     if (!data) {
          return null;
     }
     await TodosModel.delete(id);
}
