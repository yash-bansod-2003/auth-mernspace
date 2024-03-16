import supertest from "supertest";
import { createServer } from "@/server";
import { DataSource } from "typeorm";
import { AppDataSource } from "@/data-source";
import { type UserData } from "@/types";

describe("auth login", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("post /api/auth/login", () => {
    it("should returns status 200", async () => {
      const userData: Pick<UserData, "email" | "password"> = {
        email: "test@example.com",
        password: "secret",
      };
      await supertest(createServer())
        .post("/api/auth/login")
        .send(userData)
        .expect(200)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });
  });
});
