import { createServer } from "@/server";
import supertest from "supertest";

describe("auth self", () => {
  describe("get /api/auth/self", () => {
    it("should return 200 status", async () => {
      await supertest(createServer()).get("/api/auth/self").expect(200);
    });
  });
});
