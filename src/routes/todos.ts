import express from "express";
import {
     createTodos,
     getTodo,
     getTodoById,
     updateTodo,
     deleteTodo,
} from "../controller/todos";
import { authenticate } from "../middlewares/auth";
import { validateReqBody } from "../middlewares/validator";
import { createTodosBodySchema, updateTodosBodySchema } from "../schema/todos";

const router = express();

router.get("/", authenticate, getTodo);
router.get("/:id", authenticate, getTodoById);
router.post(
     "/",
     validateReqBody(createTodosBodySchema),
     authenticate,
     createTodos
);
router.put(
     "/:id",
     validateReqBody(updateTodosBodySchema),
     authenticate,
     updateTodo
);
router.delete("/:id", authenticate, deleteTodo);

export default router;
