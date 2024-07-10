import { User } from "../interface/user";
import { PERMISSION } from "../constants/permissions";

let users: User[] = [
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
          permissions: [],
     },
];

export function getUser() {
     return users;
}

export function createUser(
     user: Pick<User, "name" | "email" | "password" | "permissions">
) {
     users.push({ ...user, id: `${users.length + 1}` });
}

export function getUserByEmail(email: string) {
     return users.find(({ email: userEmail }) => userEmail === email); // destructuring and renaming email to userEmail
}

export function updateUser(
     id: string,
     { name, email, password, permissions }: User
) {
     let updatedValue;

     users = users.map((userElement) =>
          userElement.id !== id
               ? userElement
               : (updatedValue = {
                      ...userElement,
                      name,
                      email,
                      password,
                      permissions,
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
