import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import { TodoService } from "@/services/todo.service";
import { Todo } from "@/models/todo";

class TodoController {
  private todoService: TodoService;
  private logger: Logger;

  constructor(todoService: TodoService, logger: Logger) {
    this.todoService = todoService;
    this.logger = logger;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.debug("creating todo...");
      const todo = await this.todoService.create(req.body as unknown as Todo);
      this.logger.debug("created todo");
      res.status(201).json(todo);
    } catch (error) {
      return next(error);
    }
  }
}

export { TodoController };
