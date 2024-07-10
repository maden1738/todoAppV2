import { User } from "../interface/user";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "./user";

import { sign } from "jsonwebtoken";
import config from "../config";
import { RefreshToken } from "../interface/refreshToken";
import { createAccessToken } from "../utils/createAccessToken";

export async function signup(body: Pick<User, "name" | "email" | "password">) {
     const password = await bcrypt.hash(body.password, 10);

     createUser({ ...body, password });
}

export async function login(body: Pick<User, "email" | "password">) {
     const existingUser = getUserByEmail(body.email);

     if (!existingUser) {
          return {
               error: "No user with such email",
          };
     }

     const isPasswordValid = await bcrypt.compare(
          body.password,
          existingUser.password
     );

     if (!isPasswordValid) {
          return {
               error: "Password Incorrect",
          };
     }

     const payload = {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
     };

     const accessToken = sign(payload, config.jwt.secret!, {
          expiresIn: config.jwt.accessTokenExpirySeconds,
     });

     const refreshToken = sign(payload, config.jwt.secret!, {
          expiresIn: config.jwt.refreshTokenExpirySeconds,
     });

     return {
          accessToken,
          refreshToken,
     };
}

export function refresh(body: RefreshToken) {
     const { refreshToken } = body;
     if (!refreshToken) {
          return {
               error: "Refresh token doesn't exist",
          };
     }

     const accessToken = createAccessToken(refreshToken);

     return { accessToken };
}
