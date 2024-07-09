import { User } from "../interface/user";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "./user";

import { sign, verify } from "jsonwebtoken";
import config from "../config";
import { decode } from "punycode";

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
          expiresIn: config.jwt.accessTokenExpiryMS,
     });

     const refreshToken = sign(payload, config.jwt.secret!, {
          expiresIn: config.jwt.refreshTokenExpiryMS,
     });

     return {
          accessToken,
          refreshToken,
     };
}

export function refresh(body: { refreshToken: string }) {
     const { refreshToken } = body;
     if (!refreshToken) {
          return {
               error: "Refresh token doesnt exist",
          };
     }

     const decoded: any = verify(refreshToken, config.jwt.secret!);
     const payload = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
     };

     const accessToken = sign(payload, config.jwt.secret!, {
          expiresIn: config.jwt.accessTokenExpiryMS,
     });

     return accessToken;
}
