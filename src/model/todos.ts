import { Todo } from "../interface/todos";

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

export function getTodos(userId: string) {
     return todos.filter((todo) => todo.createdBy === userId);
}

export function getTodoById(id: string, userId: string) {
     return todos.find(
          ({ id: todoId, createdBy }) => todoId === id && createdBy === userId
     );
}

export function createTodos(body: Todo, userId: string) {
     const newTodo = { id: `${todos.length + 1}`, createdBy: userId, ...body };
     todos.push(newTodo);
     return newTodo;
}

export function updateTodo(id: string, { todo, status, dueDate }: Todo) {
     let updatedValue;

     todos = todos.map((todoElement) =>
          todoElement.id !== id
               ? todoElement
               : (updatedValue = { ...todoElement, todo, status, dueDate })
     );
     return updatedValue;
}

export function deleteTodo(id: string) {
     todos = todos.filter((todo) => todo.id !== id);
}
