import express from "express";
import todosRouter from "./todos";
import userRouter from "./user";
import authRouter from "./auth";

const router = express();

router.use("/todos", todosRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);

export default router;
