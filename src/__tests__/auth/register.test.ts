import supertest from "supertest";
import { createServer } from "@/server";
import { DataSource } from "typeorm";
import { AppDataSource } from "@/data-source";
import { truncateTables } from "@/lib/truncate-tables";
import { User } from "@/entity/user";
import { type UserData } from "@/types";

describe("auth register", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await truncateTables(connection);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("post /api/auth/register", () => {
    it("should returns status 201", async () => {
      const userData: UserData = {
        firstName: "yash",
        lastName: "bansod",
        email: "test@example.com",
        password: "secret",
      };

      await supertest(createServer())
        .post("/api/auth/register")
        .send(userData)
        .expect(201)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should return valid JSON response", async () => {
      const userData: UserData = {
        firstName: "yash",
        lastName: "bansod",
        email: "test@example.com",
        password: "secret",
      };

      await supertest(createServer())
        .post("/api/auth/register")
        .send(userData)
        .expect(201)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body).toBeDefined();
        });
    });

    it("should persist user in database", async () => {
      const userData: UserData = {
        firstName: "yash",
        lastName: "bansod",
        email: "test@example.com",
        password: "secret",
      };

      await supertest(createServer())
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toBeDefined();
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });

    it("should return id of persisted user", async () => {
      const userData: UserData = {
        firstName: "yash",
        lastName: "bansod",
        email: "test@example.com",
        password: "secret",
      };

      await supertest(createServer())
        .post("/api/auth/register")
        .send(userData)
        .expect(201)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect((res.body as unknown as { id: string }).id).toBeDefined();
        });
    });
  });
});
