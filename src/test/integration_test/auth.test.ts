import express, { response } from "express";
import router from "../../routes";
import {
     notFoundError,
     genericErrorHandler,
} from "../../middlewares/errorHandler";
import request from "supertest";
import HttpStatusCodes from "http-status-codes";
import expect from "expect";
import bcrypt from "bcrypt";
import { users } from "../../model/user";
import { ok } from "assert";
import config from "../../config";

const { test } = config;

describe("Auth Api Test Suite", () => {
     const app = express();

     app.use(express.json());
     app.use(router);
     app.use(notFoundError);
     app.use(genericErrorHandler);
     describe("Signup", () => {
          it("should create new user", async () => {
               const signupBody = {
                    name: "test",
                    email: "t@t.com",
                    password: "Asdf1234*",
               };

               const response = await request(app)
                    .post("/auth/signup")
                    .send(signupBody)
                    .expect(HttpStatusCodes.CREATED);

               const isPasswordCorrect = await bcrypt.compare(
                    signupBody.password,
                    response.body.data.password
               );

               expect(response.body.message).toBe("user created successfully");
               expect(response.body.data.name).toBe(signupBody.name);
               expect(response.body.data.email).toBe(signupBody.email);
               expect(isPasswordCorrect).toBe(true);

               // checking if user is added
               const addedUser = users.find(
                    (user) => user.email === signupBody.email
               );
               expect(addedUser).toBeDefined();
               expect(addedUser.name).toBe(signupBody.name);
               expect(addedUser.email).toBe(signupBody.email);
          });

          it("should return 400 if user with email already exists", async () => {
               const existingEmail = users[0].email;

               const userBody = {
                    name: "test",
                    email: existingEmail,
                    password: "Test1234*",
               };

               const response = await request(app)
                    .post("/auth/signup")
                    .send(userBody)
                    .expect(HttpStatusCodes.BAD_REQUEST);

               expect(response.body.message).toBe(
                    "User with that email already exists"
               );
          });
     });

     describe("Login", () => {
          it("should return tokens for valild credentials", async () => {
               const loginData = {
                    email: "user2@g.com",
                    password: "1234",
               };

               const response = await request(app)
                    .post("/auth/login")
                    .send(loginData)
                    .expect(ok);

               expect(response.body.accessToken).toBeDefined();
               expect(response.body.refreshToken).toBeDefined();
          });

          it("should return 401 unauthorized error for invalid credentials", async () => {
               const loginData = {
                    email: "blabl@gmail.com",
                    password: "password",
               };

               const response = await request(app)
                    .post("/auth/login")
                    .send(loginData)
                    .expect(HttpStatusCodes.UNAUTHORIZED);

               expect(response.body.accessToken).toBeUndefined();
               expect(response.body.message).toBe("Invalid Email or Password");
          });
     });

     describe("Refresh", async () => {
          it("should return fresh access token", async () => {
               const refreshBody = {
                    refreshToken: test.refreshToken,
               };

               const response = await request(app)
                    .post("/auth/refresh")
                    .send(refreshBody)
                    .expect(HttpStatusCodes.OK);

               expect(response.body.accessToken).toBeDefined();
          });

          it("should return 401 Unauthorized if refresh token is incorrect", async () => {
               const refreshBody = {
                    refreshToken: "incorrectToken",
               };

               const response = await request(app)
                    .post("/auth/refresh")
                    .send(refreshBody)
                    .expect(HttpStatusCodes.UNAUTHORIZED);

               expect(response.body.message).toBe("Unauthenticated");
          });
     });
});
