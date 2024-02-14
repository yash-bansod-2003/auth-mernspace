import { Router } from "express";
import { TodoController } from "@/controllers/todo.controller";
import { TodoService } from "@/services/todo.service";
import { TodoModel } from "@/models/todo";
import { logger } from "@/config/logger";

const router = Router();

const todoService = new TodoService(TodoModel);
const todoController = new TodoController(todoService, logger);

router.post("/todos", async (req, res, next) => {
  await todoController.create(req, res, next);
});

export { router as todoRouter };
