import { GetUserQuery, User } from "../interface/user";
import { PERMISSION } from "../constants/permissions";
import loggerWithNamespace from "../utils/logger";

export let users: User[] = [
     {
          name: "user1",
          email: "user1@g.com",
          password:
               "$2b$10$N5zpXnpAd9yqwebahVEYHeT2APESXkefOkCLwb3484TLirasXMDqe",
          id: "1",
          permissions: [PERMISSION.SUPER_ADMIN],
     },
     {
          name: "user2",
          email: "user2@g.com",
          password:
               "$2b$10$N5zpXnpAd9yqwebahVEYHeT2APESXkefOkCLwb3484TLirasXMDqe",
          id: "2",
          permissions: [PERMISSION.USER],
     },
];

const logger = loggerWithNamespace("UserModel");

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
     user: Pick<User, "name" | "email" | "password" | "permissions">
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
