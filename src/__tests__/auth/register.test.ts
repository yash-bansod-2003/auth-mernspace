import supertest from "supertest";
import { createServer } from "@/server";
import { DataSource } from "typeorm";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/user";
import { type UserData } from "@/types";
import { UserRoles } from "@/constants";
import { RefreshToken } from "@/entity/refresh-token";

describe("auth register", () => {
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
        .expect(201);
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

    it("should assign default customer role", async () => {
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

      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(UserRoles.CUSTOMER);
    });

    it("should store hashed password in database", async () => {
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

      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/\$2[a|b]\$\d+\$/);
    });

    it("should return 409 conflict if email already exists", async () => {
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

      await supertest(createServer())
        .post("/api/auth/register")
        .send(userData)
        .expect(409);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
    });

    it("should return 422 (Unprocessable Entity) if email filed is missing", async () => {
      const userData: Omit<UserData, "email"> = {
        firstName: "yash",
        lastName: "bansod",
        password: "secret",
      };

      await supertest(createServer())
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(0);
    });

    it("should return 422 (Unprocessable Entity) if password filed is missing", async () => {
      const userData: Omit<UserData, "password"> = {
        firstName: "yash",
        lastName: "bansod",
        email: "test@example.com",
      };

      await supertest(createServer())
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(0);
    });

    it.todo(
      "should return 422 (Unprocessable Entity) if firstName filed is missing",
    );
    it.todo(
      "should return 422 (Unprocessable Entity) if lastName filed is missing",
    );

    it("should trim email field", async () => {
      const userData: UserData = {
        firstName: "yash",
        lastName: "bansod",
        email: " test@example.com ",
        password: "secret",
      };

      await supertest(createServer())
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users[0].email).toBe(userData.email.trim());
      expect(users).toHaveLength(1);
    });

    it("should return accessToken in cookies", async () => {
      const userData: UserData = {
        firstName: "yash",
        lastName: "bansod",
        email: " test@example.com ",
        password: "secret",
      };

      await supertest(createServer())
        .post("/api/auth/register")
        .send(userData)
        .expect(201)
        .then((res) => {
          expect(res.headers["set-cookie"]).toBeDefined();
          expect(
            (res.headers["set-cookie"] as unknown as []).some(
              (cookie: string) => cookie.includes("accessToken"),
            ),
          ).toBe(true);
        });
    });

    it("should return refreshToken in cookies", async () => {
      const userData: UserData = {
        firstName: "yash",
        lastName: "bansod",
        email: " test@example.com ",
        password: "secret",
      };

      await supertest(createServer())
        .post("/api/auth/register")
        .send(userData)
        .expect(201)
        .then((res) => {
          expect(res.headers["set-cookie"]).toBeDefined();
          expect(
            (res.headers["set-cookie"] as unknown as []).some(
              (cookie: string) => cookie.includes("refreshToken"),
            ),
          ).toBe(true);
        });
    });

    it("should return refreshToken in cookies", async () => {
      const userData: UserData = {
        firstName: "yash",
        lastName: "bansod",
        email: " test@example.com ",
        password: "secret",
      };

      const response = await supertest(createServer())
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      const refreshTokenRepository = connection.getRepository(RefreshToken);

      const tokens = await refreshTokenRepository
        .createQueryBuilder("refreshToken")
        .where("refreshToken.userId = :userId", {
          userId: (response.body as Record<string, string>).id,
        })
        .getMany();

      expect(tokens).toHaveLength(1);
    });
  });
});
