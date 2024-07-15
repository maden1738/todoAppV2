import express from "express";
import request from "supertest";
import router from "../../routes";
import expect from "expect";
import HttpStatusCodes from "http-status-codes";
import config from "../../config";
import { verify } from "jsonwebtoken";
import {
     genericErrorHandler,
     notFoundError,
} from "../../middlewares/errorHandler";
import { todos } from "../../model/todos";
import { User } from "../../interface/user";

const { test, jwt } = config;

describe("Service Integration Test Suite", () => {
     const app = express();

     app.use(express.json());
     app.use(router);
     app.use(notFoundError);
     app.use(genericErrorHandler);

     describe("getTodo", () => {
          it("should return all todos created by user", async () => {
               const response = await request(app)
                    .get("/todos")
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .expect(HttpStatusCodes.OK);

               const user = verify(test.accessToken, jwt.secret) as User;

               const expectedOutput = todos.filter(
                    (todo) => todo.createdBy === user.id
               );

               expect(response.body.data).toStrictEqual(expectedOutput);
          });
     });

     describe("getTodoById", () => {
          it("should return todos by id", async () => {
               const id = "3";
               const response = await request(app)
                    .get(`/todos/${id}`)
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .expect(HttpStatusCodes.OK);

               const user = verify(test.accessToken, jwt.secret) as User;

               const expectedOutput = todos.find(
                    ({ id: todoId, createdBy }) =>
                         todoId === id && createdBy === user.id
               );

               expect(response.body).toStrictEqual(expectedOutput);
          });

          it("should return 400 Bad Request if id is not found", async () => {
               const id = "10";

               const response = await request(app)
                    .get(`/todos/${id}`)
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .expect(HttpStatusCodes.BAD_REQUEST);

               expect(response.body.message).toBe(
                    `Todo with id: ${id} doesnt exist`
               );
          });

          it("should return 401 unauthorized if not authenticated", async () => {
               await request(app)
                    .get("/todos/1")
                    .expect(HttpStatusCodes.UNAUTHORIZED);
          });
     });

     describe("createTodo", () => {
          it("should create new Todo", async () => {
               const todoBody = {
                    todo: "test",
                    dueDate: "2024-06-09",
                    status: "incomplete",
               };

               const response = await request(app)
                    .post("/todos")
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .send(todoBody)
                    .expect(HttpStatusCodes.CREATED);

               expect(response.body.message).toBe("Todos Created");
               expect(response.body.data.todo).toBe(todoBody.todo);
               expect(response.body.data.status).toBe(todoBody.status);
          });

          it("should return 401 unauthorized if not authenticated", async () => {
               const todoBody = {
                    todo: "test",
                    dueDate: "2024-06-09",
                    status: "incomplete",
               };
               await request(app)
                    .post("/todos")
                    .send(todoBody)
                    .expect(HttpStatusCodes.UNAUTHORIZED);
          });
     });

     describe("updateTodo", () => {
          it("should update the todo", async () => {
               const id = "3";
               const userBody = {
                    status: "incomplete",
                    dueDate: "2024-09-25",
               };
               const dataToBeUpdated = todos.find(
                    ({ id: todoId }) => todoId === id
               );

               const response = await request(app)
                    .put(`/todos/${id}`)
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .send(userBody)
                    .expect(HttpStatusCodes.OK);

               const expectedOutput = { ...dataToBeUpdated, ...userBody };

               expect(response.body.todo).toBe(expectedOutput.todo);
               expect(response.body.id).toBe(expectedOutput.id);
               expect(response.body.status).toBe(expectedOutput.status);
               expect(response.body.createdBy).toBe(expectedOutput.createdBy);
          });

          it("should return 400 Bad Request if id is not found", async () => {
               const id = "10";
               const userBody = {
                    status: "incomplete",
                    dueDate: "2024-09-25",
               };
               const response = await request(app)
                    .put(`/todos/${id}`)
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .send(userBody)
                    .expect(HttpStatusCodes.BAD_REQUEST);

               expect(response.body.message).toBe(
                    `Todo with id: ${id} doesnt exist`
               );
          });

          it("should return 401 unauthorized if not authenticated", async () => {
               const todoBody = {
                    todo: "test",
                    dueDate: "2024-06-09",
                    status: "incomplete",
               };
               await request(app)
                    .put("/todos/3")
                    .send(todoBody)
                    .expect(HttpStatusCodes.UNAUTHORIZED);
          });
     });

     describe("deleteTodo", () => {
          it("should delete the todo", async () => {
               const id = "3";
               const response = await request(app)
                    .delete(`/todos/${id}`)
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .expect(HttpStatusCodes.OK);

               expect(response.body.message).toBe(
                    `Todo with id: ${id} deleted`
               );

               // checking if todo is deleted
               const todo = todos.find(({ id: todoId }) => todoId === id);
               expect(todo).toBeUndefined();
          });

          it("should return 400 Bad Request if id is not found", async () => {
               const id = "10";

               const response = await request(app)
                    .delete(`/todos/${id}`)
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .expect(HttpStatusCodes.BAD_REQUEST);

               expect(response.body.message).toBe(
                    `Todo with id: ${id} doesnt exist`
               );
          });

          it("should return 401 unauthorized if not authenticated", async () => {
               await request(app)
                    .get("/todos/1")
                    .expect(HttpStatusCodes.UNAUTHORIZED);
          });
     });
});
