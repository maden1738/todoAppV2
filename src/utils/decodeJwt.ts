import { Request } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import config from "../config";

export function decodeJwt(req: Request) {
     const { authorization } = req.headers;
     const token = authorization?.split(" ")[1]!; // we can assert its existence since we know it is valid from auth middleware

     const decoded = verify(token, config.jwt.secret!) as JwtPayload;
     return decoded;
}
