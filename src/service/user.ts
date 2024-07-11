import * as UserModel from "../model/user";
import { GetUserQuery, User } from "../interface/user";
import loggerWithNameSpace from "../utils/logger";
import bcrypt from "bcrypt";

const logger = loggerWithNameSpace("UserService");

export function getUser(query: GetUserQuery) {
     logger.info("getUser");
     return UserModel.getUser(query);
}

export function getUserById(id: string) {
     logger.info("getUserById");
     return UserModel.getUserById(id);
}

export async function createUser(
     user: Pick<User, "name" | "email" | "password" | "permissions">
) {
     logger.info("createUser");
     const password = await bcrypt.hash(user.password, 10);

     UserModel.createUser({ ...user, password });
}

export function getUserByEmail(email: string) {
     logger.info("getUserByEmail");
     return UserModel.getUserByEmail(email);
}

export async function updateUser(id: string, user: User) {
     logger.info("updateUser");
     const data = UserModel.getUserById(id);

     if (!data) {
          return;
     }

     if (user.password) {
          const password = await bcrypt.hash(user.password, 10);
          return UserModel.updateUser(id, { ...user, password });
     }

     return UserModel.updateUser(id, user);
}

export function deleteUser(id: string) {
     logger.info("deleteUser");
     const data = UserModel.getUserById(id);

     if (!data) {
          return null;
     }

     UserModel.deleteUser(id);
}
