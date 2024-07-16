import { GetUserQuery, User } from "../interface/user";
import { PERMISSION } from "../constants/permissions";
import loggerWithNamespace from "../utils/logger";
import { BaseModel } from "./base";

const logger = loggerWithNamespace("UserModel");

export class UserModel extends BaseModel {
     static async getUsers(query: GetUserQuery) {
          logger.info("getUsers");

          const { q, size, page } = query;

          const data = this.queryBuilder()
               .table("users")
               .join("permissions", "users.id", "=", "permissions.userId")
               .select("users.id", "name", "email", "permission")
               .limit(size)
               .offset((page - 1) * size);

          if (q) {
               data.whereLike("name", `%${q}%`);
          }

          return data;
     }

     static async count(query: GetUserQuery) {
          const { q } = query;

          const data = this.queryBuilder()
               .count("*")
               .table("users")
               .join("permissions", "users.id", "=", "permissions.userId")
               .first();

          if (q) {
               data.whereLike("name", `%${q}%`);
          }

          return data;
     }

     static async getUserByEmail(email: string) {
          logger.info("getUserByEmail");

          const data = await this.queryBuilder()
               .table("users")
               .join("permissions", "users.id", "=", "permissions.userId")
               .select("users.id", "name", "email", "password", "permission")
               .where("email", email);

          if (data.length > 0) {
               return data[0];
          }
     }

     static async getUserById(id: string) {
          logger.info("getUserById");

          const data = await this.queryBuilder()
               .table("users")
               .join("permissions", "users.id", "=", "permissions.userId")
               .select("users.id", "name", "email", "password", "permission")
               .where("users.id", id);

          if (data.length > 0) {
               return data[0];
          }
     }

     static async create(
          user: Pick<User, "name" | "email" | "password" | "permission">,
          createdBy: string | null
     ) {
          logger.info("createUser");

          const userToCreate = {
               name: user.name,
               email: user.email,
               password: user.password,
               createdBy: createdBy,
          };

          const [userId] = await this.queryBuilder()
               .insert(userToCreate)
               .table("users")
               .returning("id");

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

     static async update(id: string, user: User) {
          logger.info("update");

          let userToUpdate = {
               updatedAt: new Date(),
          };

          if (user.name) {
               userToUpdate["name"] = user.name;
          }

          if (user.email) {
               userToUpdate["email"] = user.email;
          }

          if (user.password) {
               userToUpdate["password"] = user.password;
          }

          await this.queryBuilder()
               .update(userToUpdate)
               .table("users")
               .where({ id });

          if (user.permission) {
               await this.queryBuilder()
                    .update({
                         permission: user.permission,
                    })
                    .table("permissions")
                    .where({ userId: id });
          }

          return await UserModel.getUserById(id);
     }

     static async delete(id: string) {
          logger.info("deleteUser");

          await this.queryBuilder()
               .delete()
               .table("permissions")
               .where({ userId: id });

          await this.queryBuilder().delete().table("users").where({ id });
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
     const newUser = { ...user, id: `${users.length + 1}` };
     users.push(newUser);

     return newUser;
}

export function getUserByEmail(email: string) {
     return users.find(({ email: userEmail }) => userEmail === email); // destructuring and renaming email to userEmail
}

export function updateUser(id: string, user: User) {
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
     return users.find(({ id: userId }) => userId === id);
}

export function deleteUser(id: string) {
     users = users.filter((user) => user.id !== id);
}
