import { User } from "../interface/user";

const users: User[] = [
     {
          name: "user1",
          email: "user1@g.com",
          password:
               "$2b$10$N5zpXnpAd9yqwebahVEYHeT2APESXkefOkCLwb3484TLirasXMDqe",
          id: "1",
     },
];

export function getUser() {
     return users;
}

export function createUser(user: Pick<User, "name" | "email" | "password">) {
     users.push({ ...user, id: `${users.length + 1}` });
}

export function getUserByEmail(email: string) {
     return users.find(({ email: userEmail }) => userEmail === email); // destructuring and renaming id to userId
}
