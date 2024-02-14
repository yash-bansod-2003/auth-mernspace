import { createServer } from "@/server";
import supertest from "supertest";

describe("Todo", () => {
  describe("POST /todo", () => {
    it("should return 201 status", async () => {
      await supertest(createServer()).post("/todo").expect(201);
    });
  });
});
