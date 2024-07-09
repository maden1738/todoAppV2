import * as UserModel from "../model/user";
import { User } from "../interface/user";

export function getUser() {
     return UserModel.getUser();
}

export function createUser(user: Pick<User, "name" | "email" | "password">) {
     UserModel.createUser(user);
}

export function getUserByEmail(email: string) {
     return UserModel.getUserByEmail(email);
}
