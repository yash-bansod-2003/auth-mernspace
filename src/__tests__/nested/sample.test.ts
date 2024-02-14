import supertest from "supertest";
import { createServer } from "@/server";

describe("sample", () => {
  describe("POST /sample", () => {
    it("should return 201 status", async () => {
      await supertest(createServer()).post("/sample").expect(201);
    });
  });
});
