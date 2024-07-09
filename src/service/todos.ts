import { Todo } from "../interface/todos";
import * as TodosModel from "../model/todos";

export function getTodos(userId: string) {
     const data = TodosModel.getTodos(userId);
     return data;
}

export function getTodoById(id: string, userId: string) {
     const data = TodosModel.getTodoById(id, userId);
     if (!data) {
          return {
               error: `Todo with id: ${id} not found`,
          };
     }
     return data;
}

export function createTodos(todo: Todo, userId: string) {
     return TodosModel.createTodos(todo, userId);
}

export function updateTodo(id: string, body: Todo, userId: string) {
     const data = TodosModel.getTodoById(id, userId);
     if (!data) {
          return {
               error: `Todo with id: ${id} not found`,
          };
     }
     return TodosModel.updateTodo(id, body);
}

export function deleteTodo(id: string, userId: string) {
     const data = TodosModel.getTodoById(id, userId);
     if (!data) {
          return {
               error: `Todo with id: ${id} not found`,
          };
     }
     TodosModel.deleteTodo(id);
}
