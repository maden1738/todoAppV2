import sinon from "sinon";
import * as UserModel from "../../../model/user";
import expect from "expect";
import {
     getUserById,
     createUser,
     getUser,
     getUserByEmail,
     updateUser,
     deleteUser,
} from "../../../service/user";
import bcrypt from "bcrypt";
import { GetUserQuery, User } from "../../../interface/user";
import { users } from "../../../model/user";
import { describe } from "mocha";

describe("User Service Test Suite", () => {
     describe("getUer", () => {
          let userModelGetUserStub: sinon.SinonStub;

          beforeEach(() => {
               userModelGetUserStub = sinon.stub(UserModel, "getUser");
          });

          afterEach(() => {
               userModelGetUserStub.restore();
          });

          it("should return user with the provided query", () => {
               const query: GetUserQuery = { q: "te" };

               const expectedUser = {
                    id: "1",
                    name: "test",
                    email: "test@t.com",
                    password: "test1234",
                    permissions: [],
               };

               userModelGetUserStub.returns(expectedUser);

               const response = getUser(query);

               expect(userModelGetUserStub.calledOnceWith(query)).toBe(true);
               expect(response).toStrictEqual(expectedUser);
          });

          it("should return undefined when no user is found", () => {
               const query: GetUserQuery = { q: "ram" };

               userModelGetUserStub.returns(undefined);

               const response = getUser(query);

               expect(userModelGetUserStub.calledOnceWith(query)).toBe(true);
               expect(response).toBe(undefined);
          });

          it("should return all users if query is not given", () => {
               let query: GetUserQuery;

               const usersArr = [...users];

               userModelGetUserStub.returns(usersArr);

               const response = getUser(query);

               expect(response).toStrictEqual(usersArr);
               expect(userModelGetUserStub.getCall(0).args).toStrictEqual([
                    query,
               ]);
          });
     });

     describe("getUserById", () => {
          let userModelGetUserByIdStub: sinon.SinonStub;

          beforeEach(() => {
               userModelGetUserByIdStub = sinon.stub(UserModel, "getUserById");
          });

          afterEach(() => {
               userModelGetUserByIdStub.restore();
          });

          it("should return undefined when user is not found", () => {
               userModelGetUserByIdStub.returns(undefined);

               const response = getUserById("100");

               expect(response).toBe(undefined);
          });

          it("show return user if user is found", () => {
               const user = {
                    id: "1",
                    name: "test",
                    email: "test@t.com",
                    password: "test1234",
                    permissions: [],
               };

               userModelGetUserByIdStub.returns(user);

               const response = getUserById("1");

               expect(response).toStrictEqual(user);
          });
     });

     describe("getUserByEmail", () => {
          let userModelGetUserByEmailStub: sinon.SinonStub;

          beforeEach(() => {
               userModelGetUserByEmailStub = sinon.stub(
                    UserModel,
                    "getUserByEmail"
               );
          });

          afterEach(() => {
               userModelGetUserByEmailStub.restore();
          });

          it("should return undefined when user is not found", () => {
               userModelGetUserByEmailStub.returns(undefined);

               const response = getUserByEmail("uniqueEmail@test.com");

               expect(response).toBe(undefined);
          });

          it("show return user if user is found", () => {
               const user = {
                    id: "1",
                    name: "test",
                    email: "test@t.com",
                    password: "test1234",
                    permissions: [],
               };

               userModelGetUserByEmailStub.returns(user);

               const response = getUserByEmail("test@t.com");

               expect(response).toStrictEqual(user);
          });
     });

     describe("createUser", () => {
          let bcryptHashStub: sinon.SinonStub;
          let userModelGetUserByEmailStub: sinon.SinonStub;
          let userModelCreateUserStub: sinon.SinonStub;

          beforeEach(() => {
               bcryptHashStub = sinon.stub(bcrypt, "hash");
               userModelGetUserByEmailStub = sinon.stub(
                    UserModel,
                    "getUserByEmail"
               );
               userModelCreateUserStub = sinon.stub(UserModel, "createUser");
          });

          afterEach(() => {
               sinon.restore();
          });

          it("should create new user when email is not already used", async () => {
               const user = {
                    name: "test",
                    email: "test@t.com",
                    password: "test1234",
                    id: "1",
                    permissions: [],
               };

               bcryptHashStub.resolves("hashedPassword");
               userModelGetUserByEmailStub.returns(undefined);
               userModelCreateUserStub.returns({
                    ...user,
                    password: "hashedPassword",
               });

               const response = await createUser(user);

               expect(response).toStrictEqual({
                    ...user,
                    password: "hashedPassword",
               });

               expect(
                    userModelGetUserByEmailStub.calledOnceWith(user.email)
               ).toBe(true);
               expect(bcryptHashStub.calledOnceWith(user.password, 10)).toBe(
                    true
               );
               expect(
                    userModelCreateUserStub.calledOnceWith({
                         ...user,
                         password: "hashedPassword",
                    })
               ).toBe(true);
          });

          it("should not create a user when email already exists", async () => {
               const user = {
                    name: "test",
                    email: "test@t.com",
                    password: "test1234",
                    id: "1",
                    permissions: [],
               };

               userModelGetUserByEmailStub.returns({ ...user, id: "2" });

               const response = await createUser(user);

               expect(
                    userModelGetUserByEmailStub.calledOnceWith(user.email)
               ).toBe(true);
               expect(bcryptHashStub.called).toBe(false);
               expect(userModelCreateUserStub.called).toBe(false);
               expect(response).toBe(undefined);
          });
     });

     describe("updateUser", () => {
          let UserModelGetUserByIdStub: sinon.SinonStub;
          let UserModelUpdateUserStub: sinon.SinonStub;
          let bcryptHashStub: sinon.SinonStub;

          beforeEach(() => {
               UserModelGetUserByIdStub = sinon.stub(UserModel, "getUserById");
               UserModelUpdateUserStub = sinon.stub(UserModel, "updateUser");
               bcryptHashStub = sinon.stub(bcrypt, "hash");
          });

          afterEach(() => {
               sinon.restore();
          });

          it("should update user (no password change)", async () => {
               const userId = "123";
               const user = {
                    id: userId,
                    name: "test",
                    email: "test@t.com",
                    password: "test1234",
                    permissions: [],
               };
               const newUser = {
                    name: "zest",
                    email: "zest@t.com",
               };

               UserModelGetUserByIdStub.returns(user);
               UserModelUpdateUserStub.resolves({ ...user, ...newUser });

               const result = await updateUser(userId, newUser as User);

               expect(UserModelGetUserByIdStub.calledOnceWith(userId)).toBe(
                    true
               );
               expect(
                    UserModelUpdateUserStub.calledOnceWith(userId, newUser)
               ).toBe(true);
               expect(bcryptHashStub.called).toBe(false);
               expect(result).toStrictEqual({ ...user, ...newUser });
          });

          it("should update user with password change", async () => {
               const hashedPassword = "hashedPassword";
               const userId = "123";
               const user = {
                    id: userId,
                    name: "test",
                    email: "test@t.com",
                    password: "test1234",
                    permissions: [],
               };
               const newUser = {
                    password: "plainPassword",
               };

               UserModelGetUserByIdStub.returns(user);
               bcryptHashStub.resolves(hashedPassword);
               UserModelUpdateUserStub.returns({
                    ...user,
                    ...newUser,
                    hashedPassword,
               });

               const result = await updateUser(userId, newUser as User);

               expect(UserModelGetUserByIdStub.calledOnceWith(userId)).toBe(
                    true
               );
               expect(
                    UserModelUpdateUserStub.calledOnceWith(userId, {
                         ...newUser,
                         password: hashedPassword,
                    })
               ).toBe(true);
               expect(bcryptHashStub.calledOnceWith(newUser.password, 10)).toBe(
                    true
               );
               expect(result).toStrictEqual({
                    ...user,
                    ...newUser,
                    hashedPassword,
               });
          });

          it("should return undefined when user is not found", async () => {
               const userId = "100";
               const newUser = {
                    name: "test",
                    email: "test@t.com",
               };

               UserModelGetUserByIdStub.returns(undefined);

               const result = await updateUser(userId, newUser as User);

               expect(UserModelGetUserByIdStub.calledOnceWith(userId)).toBe(
                    true
               );
               expect(UserModelUpdateUserStub.called).toBe(false);
               expect(bcryptHashStub.called).toBe(false);
               expect(result).toBe(undefined);
          });
     });

     describe("deleteUser", () => {
          let UserModelGetUserByIdStub: sinon.SinonStub;
          let UserModelDeleteUserStub: sinon.SinonStub;

          beforeEach(() => {
               UserModelGetUserByIdStub = sinon.stub(UserModel, "getUserById");
               UserModelDeleteUserStub = sinon.stub(UserModel, "deleteUser");
          });

          afterEach(() => {
               sinon.restore();
          });

          it("should delete an existing user", () => {
               const userId = "1";
               const user = {
                    id: userId,
                    name: "test",
                    email: "test@t.com",
                    password: "test1234",
                    permissions: [],
               };

               UserModelGetUserByIdStub.returns(user);
               const response = deleteUser(userId);

               expect(UserModelGetUserByIdStub.calledOnceWith(userId)).toBe(
                    true
               );
               expect(UserModelDeleteUserStub.calledOnceWith(userId)).toBe(
                    true
               );
               expect(response).toBe(undefined);
          });

          it("should return null when trying to delete a non-existent user", () => {
               const userId = "100";

               UserModelGetUserByIdStub.returns(undefined);

               const response = deleteUser(userId);

               expect(UserModelGetUserByIdStub.calledOnceWith(userId)).toBe(
                    true
               );
               expect(UserModelDeleteUserStub.called).toBe(false);
               expect(response).toBe(null);
          });
     });
});
