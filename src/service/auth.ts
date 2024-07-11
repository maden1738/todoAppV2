import { User } from "../interface/user";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "./user";

import { sign } from "jsonwebtoken";
import config from "../config";
import { RefreshToken } from "../interface/refreshToken";
import { createAccessToken } from "../utils/createAccessToken";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("AuthService");

export async function signup(
     body: Pick<User, "name" | "email" | "password" | "permissions">
) {
     logger.info("Signup");
     createUser(body);
}

export async function login(body: Pick<User, "email" | "password">) {
     logger.info("Login");
     const existingUser = getUserByEmail(body.email);

     if (!existingUser) {
          logger.info("Incorrect Email");
          return;
     }

     const isPasswordValid = await bcrypt.compare(
          body.password,
          existingUser.password
     );

     if (!isPasswordValid) {
          logger.info("Incorrect Password");
          return;
     }

     const payload = {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          permissions: existingUser.permissions,
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
     logger.info("Refresh");
     const { refreshToken } = body;
     if (!refreshToken) {
          return;
     }

     const accessToken = createAccessToken(refreshToken);

     if (!accessToken) {
          return;
     }

     return { accessToken };
}
