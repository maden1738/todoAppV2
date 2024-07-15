import express from "express";
import request from "supertest";
import router from "../../routes";
import expect from "expect";
import HttpStatusCodes from "http-status-codes";
import config from "../../config";
import bcrypt from "bcrypt";
import { users } from "../.././model/user";
import {
     genericErrorHandler,
     notFoundError,
} from "../../middlewares/errorHandler";

const { test } = config;

describe("User Integration Test Suite", () => {
     const app = express();

     app.use(express.json());
     app.use(router);
     app.use(notFoundError);
     app.use(genericErrorHandler);

     // let originalUsersArr: User[];
     // beforeEach(() => {
     //      originalUsersArr = [...users];
     // });
     // afterEach(() => {
     //      UsersModel.users = originalUsersArr;
     // });

     describe("createUser Api Test", () => {
          it("should create new user", async () => {
               const userBody = {
                    name: "test",
                    email: "test@test.com",
                    password: "Test1234*",
                    permissions: [""],
               };

               const response = await request(app)
                    .post("/user")
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .send(userBody)
                    .expect(HttpStatusCodes.CREATED);

               const isPasswordCorrect = await bcrypt.compare(
                    userBody.password,
                    response.body.data.password
               );

               expect(response.body.message).toBe("User created Successfully");
               expect(response.body.data.name).toBe(userBody.name);
               expect(response.body.data.email).toBe(userBody.email);
               expect(isPasswordCorrect).toBe(true);

               // checking if user is added to usersArr
               const addedUser = users.find(
                    (user) => user.email === userBody.email
               );
               expect(addedUser).toBeDefined();
               expect(addedUser.name).toBe(userBody.name);
               expect(addedUser.email).toBe(userBody.email);
          });

          it("should return 400 if user with email already exists", async () => {
               const existingEmail = users[0].email;

               const userBody = {
                    name: "test",
                    email: existingEmail,
                    password: "Test1234*",
                    permissions: [""],
               };

               const response = await request(app)
                    .post("/user")
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .send(userBody)
                    .expect(HttpStatusCodes.BAD_REQUEST);

               expect(response.body.message).toBe(
                    "User with that email already exists"
               );
          });

          it("should return 401 unauthorized if not authenticated", async () => {
               const userBody = {
                    name: "test",
                    email: "test@t.com",
                    password: "Test1234*",
                    permissions: [""],
               };
               await request(app)
                    .post("/user")
                    .send(userBody)
                    .expect(HttpStatusCodes.UNAUTHORIZED);
          });

          it("should return 403 forbidden if not authorized", async () => {
               const userBody = {
                    name: "test",
                    email: "test@t.com",
                    password: "Test1234*",
                    permissions: [""],
               };
               await request(app)
                    .post("/user")
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .send(userBody)
                    .expect(HttpStatusCodes.FORBIDDEN);
          });
     });

     describe("getUser", () => {
          it("should return all user when no query is provided", async () => {
               const response = await request(app)
                    .get("/user")
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .expect(HttpStatusCodes.OK);

               expect(response.body).toStrictEqual(users);
          });

          it("should return users based on query", async () => {
               const query = "user";
               const response = await request(app)
                    .get(`/user?q=${query}`)
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .expect(HttpStatusCodes.OK);

               const expectedOutput = users.filter(({ name }) =>
                    name.includes(query)
               );

               expect(response.body).toStrictEqual(expectedOutput);
          });

          it("should return empty array if query doesnt match", async () => {
               const query = "idontexist";
               const response = await request(app)
                    .get(`/user?q=${query}`)
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .expect(HttpStatusCodes.OK);

               expect(response.body).toStrictEqual([]);
          });

          it("should return 401 unauthorized if not authenticated", async () => {
               await request(app)
                    .get("/user")
                    .expect(HttpStatusCodes.UNAUTHORIZED);
          });

          it("should return 403 forbidden if not authorized", async () => {
               await request(app)
                    .get("/user")
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .expect(HttpStatusCodes.FORBIDDEN);
          });
     });

     describe("getUserById", () => {
          it("should return user of the provided id", async () => {
               const id = "1";
               const response = await request(app)
                    .get(`/user/${id}`)
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .expect(HttpStatusCodes.OK);

               const expectedOutput = users.find(
                    ({ id: userId }) => userId === id
               );

               expect(response.body).toStrictEqual(expectedOutput);
          });

          it("should be bad request error if id is incorrect ", async () => {
               const id = "99999";
               const response = await request(app)
                    .get(`/user/${id}`)
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .expect(HttpStatusCodes.BAD_REQUEST);

               expect(response.body.message).toBe(
                    `User with id: ${id} not found`
               );
          });
          it("should return 401 unauthorized if not authenticated", async () => {
               await request(app)
                    .get("/user/1")
                    .expect(HttpStatusCodes.UNAUTHORIZED);
          });

          it("should return 403 forbidden if not authorized", async () => {
               await request(app)
                    .get("/user/1")
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .expect(HttpStatusCodes.FORBIDDEN);
          });
     });

     describe("updateUser", () => {
          it("should update the user's data (no password change)", async () => {
               const id = "1";
               const userBody = {
                    name: "test",
                    email: "test@test.com",
               };

               const dataToBeUpdated = users.find(
                    ({ id: userId }) => userId === id
               );
               const response = await request(app)
                    .put(`/user/${id}`)
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .send(userBody)
                    .expect(HttpStatusCodes.OK);

               const expectedOutput = { ...dataToBeUpdated, ...userBody };

               expect(response.body).toStrictEqual(expectedOutput);
          });

          it("should update the user's data (password change)", async () => {
               const id = "1";
               const userBody = {
                    name: "test",
                    email: "test@test.com",
                    password: "Asdf1234*",
               };
               const response = await request(app)
                    .put(`/user/${id}`)
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .send(userBody)
                    .expect(HttpStatusCodes.OK);

               const isPasswordCorrect = await bcrypt.compare(
                    userBody.password,
                    response.body.password
               );

               expect(isPasswordCorrect).toBe(true);
          });

          it("should be bad request error if id is incorrect ", async () => {
               const id = "99999";
               const userBody = {
                    name: "test",
                    email: "test@test.com",
                    password: "Asdf1234*",
               };
               const response = await request(app)
                    .put(`/user/${id}`)
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .send(userBody)
                    .expect(HttpStatusCodes.BAD_REQUEST);

               expect(response.body.message).toBe(
                    `User with id: ${id} not found`
               );
          });

          it("should return 401 unauthorized if not authenticated", async () => {
               const userBody = {
                    name: "test",
                    email: "test@t.com",
                    password: "Test1234*",
                    permissions: [""],
               };
               await request(app)
                    .put("/user/1")
                    .send(userBody)
                    .expect(HttpStatusCodes.UNAUTHORIZED);
          });

          it("should return 403 forbidden if not authorized", async () => {
               const userBody = {
                    name: "test",
                    email: "test@t.com",
                    password: "Test1234*",
                    permissions: [""],
               };
               await request(app)
                    .put("/user/1")
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .send(userBody)
                    .expect(HttpStatusCodes.FORBIDDEN);
          });
     });

     describe("deleteUser", () => {
          it("should delete the user", async () => {
               const id = "1";
               const response = await request(app)
                    .delete(`/user/${id}`)
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .expect(HttpStatusCodes.OK);

               expect(response.body.message).toBe(
                    `User with id: ${id} deleted`
               );

               // checking if user is deleted
               const user = users.find((user) => user.id === id);
               expect(user).toBeUndefined;
          });

          it("should return bad request error if id is incorrect", async () => {
               const id = "99999";

               const response = await request(app)
                    .put(`/user/${id}`)
                    .set(
                         "Authorization",
                         `Bearer ${test.accessTokenSuperAdmin}`
                    )
                    .expect(HttpStatusCodes.BAD_REQUEST);

               expect(response.body.message).toBe(
                    `User with id: ${id} not found`
               );
          });

          it("should return 401 unauthorized if not authenticated", async () => {
               await request(app)
                    .delete("/user/1")
                    .expect(HttpStatusCodes.UNAUTHORIZED);
          });

          it("should return 403 forbidden if not authorized", async () => {
               await request(app)
                    .delete("/user/1")
                    .set("Authorization", `Bearer ${test.accessToken}`)
                    .expect(HttpStatusCodes.FORBIDDEN);
          });
     });
});
