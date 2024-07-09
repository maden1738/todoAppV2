import { Request, Response } from "express";
import * as UserService from "../service/user";

export function getUser(req: Request, res: Response) {
     const data = UserService.getUser();
     res.json(data);
}
