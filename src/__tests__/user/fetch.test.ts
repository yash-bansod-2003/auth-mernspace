import { AppDataSource } from "@/data-source";
import { createServer } from "@/server";
import supertest from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import { UserRoles } from "@/constants";
import { User } from "@/entity/user";
import { UserData } from "@/types";

describe("user fetch", () => {
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

  describe("get /api/user", () => {
    it("should return status 200", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      await supertest(createServer())
        .get("/api/user")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should return status 403 (Forbidden) if user is not admin", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.CUSTOMER });

      await supertest(createServer())
        .get("/api/user")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(403);
    });

    it("should return array in response", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      await supertest(createServer())
        .get("/api/user")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });

  describe("get /api/user/:id", () => {
    it("should return status 200", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      await supertest(createServer())
        .get("/api/user/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should return status 403 (Forbidden) if user is not admin", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.CUSTOMER });

      await supertest(createServer())
        .get("/api/user/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(403);
    });

    it("should return user object in response", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });
      const userData: UserData = {
        firstName: "yash",
        lastName: "bansod",
        email: "test@example.com",
        password: "secret",
        role: UserRoles.MANAGER,
        tenantId: 1,
      };

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      await supertest(createServer())
        .get("/api/user/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(typeof res.body).toBe("object");
        });
    });
  });
});
