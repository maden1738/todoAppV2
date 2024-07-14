import * as TodosModel from "../../../model/todos";
import sinon from "sinon";
import {
     getTodos,
     getTodoById,
     createTodos,
     updateTodo,
     deleteTodo,
} from "../../../service/todos";
import expect from "expect";
import { Todo } from "../../../interface/todos";

describe("Todos Service Test Suite", () => {
     describe("getTodos", () => {
          let todoModelGetTodoStub: sinon.SinonStub;

          beforeEach(() => {
               todoModelGetTodoStub = sinon.stub(TodosModel, "getTodos");
          });

          afterEach(() => {
               todoModelGetTodoStub.restore();
          });

          it("should return all todos created by user", () => {
               const userId = "1";

               const expectedTodos = [
                    {
                         id: "1",
                         todo: "Learn React",
                         status: "completed",
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

               todoModelGetTodoStub.returns(expectedTodos);

               const response = getTodos(userId);

               expect(todoModelGetTodoStub.calledOnceWith(userId)).toBe(true);
               expect(response).toStrictEqual(expectedTodos);
          });
     });

     describe("getTodoById", () => {
          let todoModelGetTodoByIdStub: sinon.SinonStub;

          beforeEach(() => {
               todoModelGetTodoByIdStub = sinon.stub(TodosModel, "getTodoById");
          });

          afterEach(() => {
               todoModelGetTodoByIdStub.restore();
          });

          it("should return undefined when todo  is not found", () => {
               const userId = "1";
               const todoId = "100";
               todoModelGetTodoByIdStub.returns(undefined);

               const response = getTodoById(todoId, userId);

               expect(response).toBe(undefined);
               expect(
                    todoModelGetTodoByIdStub.calledOnceWith(todoId, userId)
               ).toBe(true);
          });

          it("show return todo if todo is found", () => {
               const userId = "1";
               const todoId = "100";
               const expectedOutput = {
                    id: "1",
                    todo: "Learn React",
                    status: "completed",
                    dueDate: "2024-08-12",
                    createdBy: "1",
               };

               todoModelGetTodoByIdStub.returns(expectedOutput);

               const response = getTodoById(todoId, userId);

               expect(response).toBe(expectedOutput);
               expect(
                    todoModelGetTodoByIdStub.calledOnceWith(todoId, userId)
               ).toBe(true);
          });
     });

     describe("createTodos", () => {
          it("should create a new todo", () => {
               const newTodo = {
                    id: "1",
                    todo: "Learn React",
                    status: "completed",
                    dueDate: "2024-08-12",
               };

               const userId = "1";
               const createdTodo = { ...newTodo, createdBy: userId };

               const todoModelCreateTodoStub = sinon
                    .stub(TodosModel, "createTodos")
                    .returns(createdTodo);

               const result = createTodos(newTodo, userId);

               expect(
                    todoModelCreateTodoStub.calledOnceWith(newTodo, userId)
               ).toBe(true);
               expect(result).toEqual(createdTodo);
          });
     });

     describe("updateTodo", () => {
          let todoModelGetTodoByIdStub: sinon.SinonStub;
          let todoModelUpdateTodoStub: sinon.SinonStub;

          beforeEach(() => {
               todoModelGetTodoByIdStub = sinon.stub(TodosModel, "getTodoById");
               todoModelUpdateTodoStub = sinon.stub(TodosModel, "updateTodo");
          });
          afterEach(() => {
               sinon.restore();
          });

          it("should update an existing todo", () => {
               const todoId = "1";
               const userId = "1";

               const todo = {
                    id: todoId,
                    todo: "learn testing",
                    status: "complete",
                    dueDate: "2024-08-12",
                    createdBy: userId,
               };
               const updatedTodo = {
                    todo: "Updated Todo",
                    status: "completed",
               };
               todoModelGetTodoByIdStub.returns(todo);
               todoModelUpdateTodoStub.returns(updatedTodo);

               const response = updateTodo(todoId, updatedTodo as Todo, userId);

               expect(
                    todoModelGetTodoByIdStub.calledOnceWith(todoId, userId)
               ).toBe(true);
               expect(
                    todoModelUpdateTodoStub.calledOnceWith(todoId, updatedTodo)
               ).toBe(true);
               expect(response).toEqual(updatedTodo);
          });

          it("should return undefined when todo does not exist", () => {
               const todoId = "100";
               const userId = "1";

               const todo = {
                    todo: "Updated Todo",
                    status: "completed",
               };
               todoModelGetTodoByIdStub.returns(undefined);

               const response = updateTodo(todoId, todo as Todo, userId);

               expect(
                    todoModelGetTodoByIdStub.calledOnceWith(todoId, userId)
               ).toBe(true);
               expect(todoModelUpdateTodoStub.called).toBe(false);
               expect(response).toBe(undefined);
          });
     });

     describe("deleteTodo", () => {
          let todoModelGetTodoByIdStub: sinon.SinonStub;
          let todoModelDeleteTodoStub: sinon.SinonStub;

          beforeEach(() => {
               todoModelGetTodoByIdStub = sinon.stub(TodosModel, "getTodoById");
               todoModelDeleteTodoStub = sinon.stub(TodosModel, "deleteTodo");
          });
          afterEach(() => {
               sinon.restore();
          });

          it("should return undefined after deleting an existing todo", () => {
               const todoId = "1";
               const userId = "1";

               const todo = {
                    id: todoId,
                    todo: "learn testing",
                    status: "complete",
                    dueDate: "2024-08-12",
                    createdBy: userId,
               };

               todoModelGetTodoByIdStub.returns(todo);

               const response = deleteTodo(todoId, userId);

               expect(
                    todoModelGetTodoByIdStub.calledOnceWith(todoId, userId)
               ).toBe(true);
               expect(todoModelDeleteTodoStub.calledOnceWith(todoId)).toBe(
                    true
               );
               expect(response).toBeUndefined();
          });

          it("should return null when todo does not exist", () => {
               const todoId = "100";
               const userId = "1";

               todoModelGetTodoByIdStub.returns(undefined);

               const response = deleteTodo(todoId, userId);

               expect(
                    todoModelGetTodoByIdStub.calledOnceWith(todoId, userId)
               ).toBe(true);
               expect(todoModelDeleteTodoStub.called).toBe(false);
               expect(response).toBe(null);
          });
     });
});
