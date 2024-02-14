import { Todo, TodoModel } from "@/models/todo";

class TodoService {
  private todoRepository: typeof TodoModel;

  constructor(todoRepository: typeof TodoModel) {
    this.todoRepository = todoRepository;
  }

  async create(todo: Todo) {
    try {
      return this.todoRepository.create(todo);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export { TodoService };
