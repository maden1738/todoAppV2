import express from "express";
import {
     createTodos,
     getTodo,
     getTodoById,
     updateTodo,
     deleteTodo,
} from "../controller/todos";

const router = express();

router.get("/", getTodo);
router.get("/:id", getTodoById);
router.post("/", createTodos);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
