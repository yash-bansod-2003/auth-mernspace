import mongoose from "mongoose";
import supertest from "supertest";
import { createServer } from "@/server";
import { connectToDatabase } from "@/lib/db";
import { CONFIG } from "@/config";
import { TodoModel, Todo } from "@/models/todo";

describe("Todo", () => {
  beforeAll(async () => {
    await connectToDatabase(CONFIG.DB_URL!);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await TodoModel.deleteMany({});
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe("POST /todos", () => {
    it("should create new todo", async () => {
      const data: Todo = {
        title: "Do Homework",
        description: "I need to survive in class",
        completed: true,
      };

      await supertest(createServer())
        .post("/todos")
        .send(data)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty("_id");
        });
    });
  });
});
