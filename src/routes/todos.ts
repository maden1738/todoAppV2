import express from "express";
import {
     createTodos,
     getTodo,
     getTodoById,
     updateTodo,
     deleteTodo,
} from "../controller/todos";
import { authenticate } from "../middlewares/auth";

const router = express();

router.get("/", authenticate, getTodo);
router.get("/:id", authenticate, getTodoById);
router.post("/", authenticate, createTodos);
router.put("/:id", authenticate, updateTodo);
router.delete("/:id", authenticate, deleteTodo);

export default router;
