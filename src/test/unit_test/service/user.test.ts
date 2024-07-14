import sinon from "sinon";
import * as UserModel from "../../../model/user";
import expect from "expect";
import { getUserById, createUser } from "../../../service/user";
import bcrypt from "bcrypt";
import * as UserService from "../../../service/user";

describe("User Service Test Suite", () => {
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

     describe("createUser", () => {
          let bcryptHashStub: sinon.SinonStub;
          let getUserByEmailStub: sinon.SinonStub;
          let userModelCreateUserStub: sinon.SinonStub;

          beforeEach(() => {
               bcryptHashStub = sinon.stub(bcrypt, "hash");
               getUserByEmailStub = sinon.stub(UserService, "getUserByEmail");
               userModelCreateUserStub = sinon.stub(UserModel, "createUser");
          });

          afterEach(() => {
               bcryptHashStub.restore();
               getUserByEmailStub.restore();
               userModelCreateUserStub.restore();
          });

          it("should create new user", async () => {
               const user = {
                    name: "test",
                    email: "test@t.com",
                    password: "test1234",
                    id: "1",
                    permissions: [],
               };

               console.log(UserService);

               bcryptHashStub.resolves("hashedPassword");
               getUserByEmailStub.returns(true);
               userModelCreateUserStub.returns({
                    ...user,
                    password: "hashedPassword",
               });

               const response = await createUser(user);

               expect(response).toStrictEqual({
                    ...user,
                    password: "hashedPassword",
               });
          });
     });
});
