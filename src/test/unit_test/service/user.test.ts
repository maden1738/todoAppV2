import Sinon from "sinon";
import * as UserModel from "../../../model/user";
import expect from "expect";
import { getUserById } from "../../../service/user";

describe("User Service Test Suite", () => {
     describe("getUserById", () => {
          let userModelGetUserByIdStub: Sinon.SinonStub;

          beforeEach(() => {
               userModelGetUserByIdStub = Sinon.stub(UserModel, "getUserById");
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
});
