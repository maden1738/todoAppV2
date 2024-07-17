import { GetUserQuery, User } from "../interface/user";
import loggerWithNameSpace from "../utils/logger";
import bcrypt from "bcrypt";
import { UserModel } from "../model/user";

const logger = loggerWithNameSpace("UserService");

export async function getUser(query: GetUserQuery) {
     logger.info("getUser");

     const data = await UserModel.getUsers(query);

     const count = await UserModel.count(query);

     const meta = {
          page: query.page,
          size: data.length,
          total: +count.count,
     };

     return { data, meta };
}

export function getUserById(id: string) {
     logger.info("getUserById");
     return UserModel.getUserById(id);
}

export async function createUser(
     user: Pick<User, "name" | "email" | "password" | "permission">,
     createdBy: string | null
) {
     logger.info("createUser");

     const data = await UserModel.getUserByEmail(user.email);

     if (data) {
          return;
     }

     const password = await bcrypt.hash(user.password, 10);

     return await UserModel.create({ ...user, password }, createdBy);
}

export async function getUserByEmail(email: string) {
     logger.info("getUserByEmail");
     return await UserModel.getUserByEmail(email);
}

export async function updateUser(id: string, user: User) {
     logger.info("updateUser");
     const data = await UserModel.getUserById(id);

     if (!data) {
          return;
     }

     if (user.password) {
          const password = await bcrypt.hash(user.password, 10);
          return await UserModel.update(id, { ...user, password });
     }

     return await UserModel.update(id, user);
}

export function deleteUser(id: string) {
     logger.info("deleteUser");
     const data = UserModel.getUserById(id);

     if (!data) {
          return null;
     }

     UserModel.delete(id);
}
