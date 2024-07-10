import { Todo } from "../interface/todos";
import * as TodosModel from "../model/todos";

export function getTodos(userId: string) {
     const data = TodosModel.getTodos(userId);
     return data;
}

export function getTodoById(id: string, userId: string) {
     const data = TodosModel.getTodoById(id, userId);
     if (data) {
          return data;
     }
}

export function createTodos(body: Todo, userId: string) {
     return TodosModel.createTodos(body, userId);
}

export function updateTodo(id: string, body: Todo, userId: string) {
     const data = TodosModel.getTodoById(id, userId);
     if (data) {
          return TodosModel.updateTodo(id, body);
     }
}

export function deleteTodo(id: string, userId: string) {
     const data = TodosModel.getTodoById(id, userId);
     if (!data) {
          return null;
     }
     TodosModel.deleteTodo(id);
}
