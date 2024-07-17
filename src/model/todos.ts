import { Todo } from "../interface/todos";
import loggerWithNamespace from "../utils/logger";
import { BaseModel } from "./base";

const logger = loggerWithNamespace("TodosModel");

export class TodosModel extends BaseModel {
     static async getTodos(userId: string) {
          logger.info("getTodos");

          const data = this.queryBuilder()
               .table("todos")
               .select("id", "todo", "dueDate")
               .where({
                    createdBy: +userId,
               });

          return data;
     }

     static async getTodoById(id: string, userId: string) {
          logger.info("getTodoById");

          const data = await this.queryBuilder()
               .table("todos")
               .select("id", "todo", "dueDate")
               .where({ id })
               .where({ createdBy: userId });

          if (data.length > 0) {
               return data[0];
          }
     }

     static async create(body: Todo, userId: string) {
          logger.info("createTodo");

          const todoToCreate = {
               todo: body.todo,
               status: body.status,
               dueDate: body.dueDate,
               createdBy: userId,
          };

          const [id] = await this.queryBuilder()
               .insert(todoToCreate)
               .table("todos")
               .returning("id");

          return await this.queryBuilder()
               .table("todos")
               .select("todo", "status", "dueDate", "createdBy")
               .where({ id: id.id })
               .first();
     }

     static async update(id: string, todo: Todo) {
          logger.info("updateTodo");
          let todoToUpdate = {
               updatedAt: new Date(),
          };

          if (todo.todo) {
               todoToUpdate["todo"] = todo.todo;
          }

          if (todo.status) {
               todoToUpdate["status"] = todo.status;
          }

          if (todo.dueDate) {
               todoToUpdate["dueDate"] = todo.dueDate;
          }

          await this.queryBuilder()
               .update(todoToUpdate)
               .table("todos")
               .where({ id });

          return await this.queryBuilder()
               .table("todos")
               .select("todo", "status", "dueDate", "createdBy")
               .where({ id })
               .first();
     }

     static async delete(id: string) {
          await this.queryBuilder().delete().table("todos").where({ id });
     }
}

// export let todos = [
//      {
//           id: "1",
//           todo: "Learn React",
//           status: "completed",
//           dueDate: "2024-08-12",
//           createdBy: "1",
//      },
//      {
//           id: "2",
//           todo: "Learn REST APIS",
//           status: "incomplete",
//           dueDate: "2024-08-20",
//           createdBy: "1",
//      },
//      {
//           id: "3",
//           todo: "Learn Sleeping",
//           status: "incomplete",
//           dueDate: "2024-08-20",
//           createdBy: "3",
//      },
// ];

// export function getTodos(userId: string) {
//      logger.info("getTodos");
//      return todos.filter((todo) => todo.createdBy === userId);
// }

// export function getTodoById(id: string, userId: string) {
//      logger.info("getTodosById");
//      return todos.find(
//           ({ id: todoId, createdBy }) => todoId === id && createdBy === userId
//      );
// }

// export function createTodos(body: Todo, userId: string) {
//      logger.info("createTodos");
//      const newTodo = { id: `${todos.length + 1}`, createdBy: userId, ...body };
//      todos.push(newTodo);
//      return newTodo;
// }

// export function updateTodo(id: string, todo: Todo) {
//      logger.info("updateTodo");
//      let updatedValue;

//      todos = todos.map((todoElement) =>
//           todoElement.id !== id
//                ? todoElement
//                : (updatedValue = { ...todoElement, ...todo })
//      );
//      return updatedValue;
// }

// export function deleteTodo(id: string) {
//      logger.info("deleteTodo");
//      todos = todos.filter((todo) => todo.id !== id);
// }
