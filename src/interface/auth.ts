import { Request as ExpressRequest } from "express";
import { User } from "./user";

export interface IRequest extends ExpressRequest {
     user?: User;
}
