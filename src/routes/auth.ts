import express from "express";
import { signup, login, refresh } from "../controller/auth";

const router = express();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;
