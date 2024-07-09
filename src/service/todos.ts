import { Todo } from "../interface/todos";
import * as TodosModel from "../model/todos";

export function getTodos() {
     const data = TodosModel.getTodos();
     return data;
}

export function getTodoById(id: string) {
     const data = TodosModel.getTodoById(id);
     if (!data) {
          return {
               error: `Todo with id: ${id} not found`,
          };
     }
     return data;
}

export function createTodos(todo: Todo) {
     return TodosModel.createTodos(todo);
}

export function updateTodo(id: string, todo: Todo) {
     const data = TodosModel.getTodoById(id);
     if (!data) {
          return {
               error: `Todo with id: ${id} not found`,
          };
     }
     return TodosModel.updateTodo(id, todo);
}

export function deleteTodo(id: string) {
     const data = TodosModel.getTodoById(id);
     if (!data) {
          return {
               error: `Todo with id: ${id} not found`,
          };
     }
     TodosModel.deleteTodo(id);
}
