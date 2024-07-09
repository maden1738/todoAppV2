import express from "express";
import todosRouter from "./todos";
import userRouter from "./user";

const router = express();

router.use("/todos", todosRouter);
router.use("/user", userRouter);

export default router;
