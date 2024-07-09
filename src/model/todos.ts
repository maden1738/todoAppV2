import { Todo } from "../interface/todos";

let todos = [
     {
          id: "1",
          todo: "Learn React",
          status: "complete",
          dueDate: "2024-08-12",
     },
     {
          id: "2",
          todo: "Learn REST APIS",
          status: "incomplete",
          dueDate: "2024-08-20",
     },
];

export function getTodos() {
     return todos;
}

export function getTodoById(id: string) {
     return todos.find(({ id: todoId }) => todoId === id); // destructuring and renaming id to userId
}

export function createTodos(todo: Todo) {
     const newTodo = { id: `${todos.length + 1}`, ...todo };
     todos.push(newTodo);
     return newTodo;
}

export function updateTodo(id: string, todo: Todo) {
     let updatedValue;
     todos = todos.map((todoElement) => {
          if (todoElement.id !== id) {
               return todoElement;
          }
          todoElement.todo = todo.todo;
          updatedValue = todoElement;
          return todoElement;
     });
     return updatedValue;
}

export function deleteTodo(id: string) {
     todos = todos.filter((todo) => todo.id !== id);
}
