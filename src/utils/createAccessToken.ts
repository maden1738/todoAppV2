import { verify, sign } from "jsonwebtoken";
import config from "../config";
import loggerWithNameSpace from "./logger";

const logger = loggerWithNameSpace("RefreshToken");

export function createAccessToken(refreshToken: string) {
     try {
          const decoded = verify(refreshToken, config.jwt.secret!);
          if (typeof decoded === "string") {
               return;
          }

          logger.info("Valid refresh token");

          const payload = {
               id: decoded.id,
               name: decoded.name,
               email: decoded.email,
          };
          const accessToken = sign(payload, config.jwt.secret!, {
               expiresIn: config.jwt.accessTokenExpirySeconds,
          });

          return accessToken;
     } catch (error) {
          return;
     }
}
