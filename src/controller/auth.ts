import { Request, Response } from "express";
import * as AuthService from "../service/auth";

export async function signup(req: Request, res: Response) {
     const { body } = req;
     await AuthService.signup(body);
     res.json({ message: "user created successfully" });
}

export async function login(req: Request, res: Response) {
     const { body } = req;

     const data = await AuthService.login(body);

     return res.json(data);
}

export function refresh(req: Request, res: Response) {
     const { body } = req;
     const data = AuthService.refresh(body);
     res.json(data);
}
