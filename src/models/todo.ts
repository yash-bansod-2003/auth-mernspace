import { Schema, Document, model } from "mongoose";

interface Todo {
  title: string;
  description?: string;
  completed: boolean;
}

type TodoDocument = Todo & Document;

const TodoSchema = new Schema<TodoDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const TodoModel = model<TodoDocument>("Todo", TodoSchema, "todos");

export { TodoModel, Todo };
