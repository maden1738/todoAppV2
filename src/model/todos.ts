import { Todo } from "../interface/todos";
import loggerWithNamespace from "../utils/logger";

let todos = [
     {
          id: "1",
          todo: "Learn React",
          status: "complete",
          dueDate: "2024-08-12",
          createdBy: "1",
     },
     {
          id: "2",
          todo: "Learn REST APIS",
          status: "incomplete",
          dueDate: "2024-08-20",
          createdBy: "1",
     },
];

const logger = loggerWithNamespace("TodosModel");

export function getTodos(userId: string) {
     logger.info("getTodos");
     return todos.filter((todo) => todo.createdBy === userId);
}

export function getTodoById(id: string, userId: string) {
     logger.info("getTodosById");
     return todos.find(
          ({ id: todoId, createdBy }) => todoId === id && createdBy === userId
     );
}

export function createTodos(body: Todo, userId: string) {
     logger.info("createTodos");
     const newTodo = { id: `${todos.length + 1}`, createdBy: userId, ...body };
     todos.push(newTodo);
     return newTodo;
}

export function updateTodo(id: string, todo: Todo) {
     logger.info("updateTodo");
     let updatedValue;

     todos = todos.map((todoElement) =>
          todoElement.id !== id
               ? todoElement
               : (updatedValue = { ...todoElement, ...todo })
     );
     return updatedValue;
}

export function deleteTodo(id: string) {
     logger.info("deleteTodo");
     todos = todos.filter((todo) => todo.id !== id);
}
