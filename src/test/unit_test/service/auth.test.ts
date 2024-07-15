import expect from "expect";
import { User } from "../../../interface/user";
import { signup, login } from "../../../service/auth";
import * as UserService from "../../../service/user";
import sinon from "sinon";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("Auth Service Test Suite", () => {
     describe("signup", () => {
          it("should return created user", async () => {
               const user = {
                    name: "test",
                    email: "test@t.com",
                    password: "test1234",
                    permissions: [],
               };
               const UserServiceCreateUserStub = sinon
                    .stub(UserService, "createUser")
                    .resolves(user as User);

               const response = await signup(user);
               expect(UserServiceCreateUserStub.calledOnceWith(user)).toBe(
                    true
               );
               expect(response).toBe(user);
          });
     });

     describe("login", () => {
          let userServiceGetUserByEmailStub: sinon.SinonStub;
          let bcryptCompareStub: sinon.SinonStub;
          let jwtSignStub: sinon.SinonStub;

          beforeEach(() => {
               userServiceGetUserByEmailStub = sinon.stub(
                    UserService,
                    "getUserByEmail"
               );
               bcryptCompareStub = sinon.stub(bcrypt, "compare");
               jwtSignStub = sinon.stub(jwt, "sign");
          });
          afterEach(() => {
               sinon.restore();
          });

          it("should return tokens for valid credentials", async () => {
               const loginData = {
                    email: "test@t.com",
                    password: "password",
               };
               const existingUser = {
                    id: "1",
                    name: "test",
                    email: "test@t.com",
                    password: "hashedPassword",
                    permissions: [],
               };

               userServiceGetUserByEmailStub.returns(existingUser);
               bcryptCompareStub.resolves(true);
               jwtSignStub.returns("token");

               const result = await login(loginData);

               expect(
                    userServiceGetUserByEmailStub.calledOnceWith(
                         loginData.email
                    )
               ).toBe(true);
               expect(
                    bcryptCompareStub.calledOnceWith(
                         loginData.password,
                         existingUser.password
                    )
               ).toBe(true);
               expect(jwtSignStub.calledTwice).toBe(true);
               expect(result).toEqual({
                    accessToken: "token",
                    refreshToken: "token",
               });
          });

          it("should return undefined for non-existent user", async () => {
               const loginData = {
                    email: "wrong@test.com",
                    password: "password",
               };
               userServiceGetUserByEmailStub.returns(undefined);

               const result = await login(loginData);

               expect(
                    userServiceGetUserByEmailStub.calledOnceWith(
                         loginData.email
                    )
               ).toBe(true);
               expect(jwtSignStub.called).toBe(false);
               expect(result).toBe(undefined);
          });

          it("should return undefined for invalid password", async () => {
               const loginData = {
                    email: "test@t.com",
                    password: "wrongpassword",
               };
               const existingUser = {
                    id: "1",
                    name: "test ",
                    email: "test@t.com",
                    password: "hashedPassword",
                    permissions: [],
               };
               userServiceGetUserByEmailStub.returns(existingUser);
               bcryptCompareStub.resolves(false);

               const result = await login(loginData);

               expect(
                    userServiceGetUserByEmailStub.calledOnceWith(
                         loginData.email
                    )
               ).toBe(true);
               expect(
                    bcryptCompareStub.calledOnceWith(
                         loginData.password,
                         existingUser.password
                    )
               ).toBe(true);

               expect(jwtSignStub.called).toBe(false);
               expect(result).toBeUndefined();
          });
     });
});
