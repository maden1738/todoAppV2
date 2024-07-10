import * as UserModel from "../model/user";
import { User } from "../interface/user";

export function getUser() {
     return UserModel.getUser();
}

export function getUserById(id: string) {
     return UserModel.getUserById(id);
}

export function createUser(
     user: Pick<User, "name" | "email" | "password" | "permissions">
) {
     UserModel.createUser(user);
}

export function getUserByEmail(email: string) {
     return UserModel.getUserByEmail(email);
}

export function updateUser(id: string, user: User) {
     const data = UserModel.getUserById(id);

     if (!data) {
          return;
     }

     return UserModel.updateUser(id, user);
}

export function deleteUser(id: string) {
     const data = UserModel.getUserById(id);

     if (!data) {
          return null;
     }

     UserModel.deleteUser(id);
}
