import { GetUserQuery, User } from "../interface/user";
import { PERMISSION } from "../constants/permissions";
import loggerWithNamespace from "../utils/logger";
import { BaseModel } from "./base";
import { permission } from "process";

const logger = loggerWithNamespace("UserModel");

export class UserModel extends BaseModel {
     static async create(
          user: Pick<User, "name" | "email" | "password" | "permission">,
          createdBy: string | null
     ) {
          const userToCreate = {
               name: user.name,
               email: user.email,
               password: user.password,
               createdBy: +createdBy,
          };

          await this.queryBuilder().insert(userToCreate).table("users");
          const userId = await this.queryBuilder()
               .select("id")
               .table("users")
               .where({
                    email: user.email,
               })
               .first();
          console.log(user.permission);

          await this.queryBuilder()
               .insert({
                    userId: userId.id,
                    permission: user.permission,
               })
               .table("permissions");

          return await this.queryBuilder()
               .table("users")
               .join("permissions", "users.id", "=", "permissions.userId")
               .select(
                    "users.id",
                    "name",
                    "email",
                    "password",
                    "permission",
                    "users.createdBy"
               )
               .where("users.id", userId.id)
               .first();
     }
}

export let users: User[] = [
     {
          name: "user1",
          email: "user1@g.com",
          password:
               "$2b$10$N5zpXnpAd9yqwebahVEYHeT2APESXkefOkCLwb3484TLirasXMDqe",
          id: "1",
          permission: PERMISSION.SUPER_ADMIN,
     },
     {
          name: "user2",
          email: "user2@g.com",
          password:
               "$2b$10$N5zpXnpAd9yqwebahVEYHeT2APESXkefOkCLwb3484TLirasXMDqe",
          id: "2",
          permission: PERMISSION.USER,
     },
];

export function getUser(query: GetUserQuery) {
     logger.info("getUser");
     const { q } = query;
     console.log(q);
     if (q) {
          return users.filter(({ name }) => name.includes(q));
     }

     return users;
}

export function createUser(
     user: Pick<User, "name" | "email" | "password" | "permission">
) {
     logger.info("createUser");
     const newUser = { ...user, id: `${users.length + 1}` };
     users.push(newUser);

     return newUser;
}

export function getUserByEmail(email: string) {
     logger.info("getUserByEmail");
     return users.find(({ email: userEmail }) => userEmail === email); // destructuring and renaming email to userEmail
}

export function updateUser(id: string, user: User) {
     logger.info("updateUser");
     let updatedValue;

     users = users.map((userElement) =>
          userElement.id !== id
               ? userElement
               : (updatedValue = {
                      ...userElement,
                      ...user,
                 })
     );
     return updatedValue;
}

export function getUserById(id: string) {
     logger.info("getUserById");
     return users.find(({ id: userId }) => userId === id);
}

export function deleteUser(id: string) {
     logger.info("deleteUser");
     users = users.filter((user) => user.id !== id);
}
