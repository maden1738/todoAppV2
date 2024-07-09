import express from "express";
import { getUser } from "../controller/user";
import { authenticate } from "../middlewares/auth";

const router = express();

router.get("/", authenticate, getUser);

export default router;
