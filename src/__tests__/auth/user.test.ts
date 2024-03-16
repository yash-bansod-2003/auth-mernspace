import { AppDataSource } from "@/data-source";
import { createServer } from "@/server";
import supertest from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import { User } from "@/entity/user";
import { UserRoles } from "@/constants";

describe("auth self", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5001");
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterEach(() => {
    jwks.stop();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("get /api/auth/self", () => {
    it("should return status 200", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.CUSTOMER });

      await supertest(createServer())
        .get("/api/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should return user data", async () => {
      // Register the user
      const userData = {
        firstName: "yash",
        lastName: "bansod",
        email: "test@example.com",
        password: "secret",
      };

      const userRepository = connection.getRepository(User);
      const user = await userRepository.save({
        ...userData,
        role: UserRoles.CUSTOMER,
      });

      // Generate token
      const accessToken = jwks.token({ sub: String(user.id), role: user.role });

      await supertest(createServer())
        .get("/api/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect((res.body as Record<string, string>).id).toBe(user.id);
        });
    });

    it("should not return password in user data", async () => {
      // Register the user
      const userData = {
        firstName: "yash",
        lastName: "bansod",
        email: "test@example.com",
        password: "secret",
      };

      const userRepository = connection.getRepository(User);
      const user = await userRepository.save({
        ...userData,
        role: UserRoles.CUSTOMER,
      });

      // Generate token
      const accessToken = jwks.token({ sub: String(user.id), role: user.role });

      await supertest(createServer())
        .get("/api/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(
            (res.body as Record<string, string>).password,
          ).not.toBeDefined();
        });
    });

    it("should return status 401 if token does not exists", async () => {
      // Register the user
      const userData = {
        firstName: "yash",
        lastName: "bansod",
        email: "test@example.com",
        password: "secret",
      };

      const userRepository = connection.getRepository(User);
      await userRepository.save({
        ...userData,
        role: UserRoles.CUSTOMER,
      });

      await supertest(createServer()).get("/api/auth/self").expect(401);
    });
  });
});
