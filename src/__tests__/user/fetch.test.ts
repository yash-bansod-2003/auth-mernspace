import { AppDataSource } from "@/data-source";
import { createServer } from "@/server";
import supertest from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import { UserRoles } from "@/constants";
import { User } from "@/entity/user";
import { UserData } from "@/types";

describe("Admin Fetch User", () => {
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

  describe("get /api/v1/admin/users", () => {
    it("should return status 200", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      await supertest(createServer())
        .get("/api/v1/admin/users")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should return status 403 (Forbidden) if user is not admin", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.CUSTOMER });

      await supertest(createServer())
        .get("/api/v1/admin/users")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(403);
    });

    it("should return paginated users", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      await supertest(createServer())
        .get("/api/v1/admin/users")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            page: 1,
            limit: 10,
            count: 0,
            data: [],
          });
        });
    });
  });

  describe("get /api/v1/admin/users/:userId", () => {
    it("should return status 200", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      await supertest(createServer())
        .get("/api/v1/admin/users/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should return status 403 (Forbidden) if user is not admin", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.CUSTOMER });

      await supertest(createServer())
        .get("/api/v1/admin/users/1")
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
        .get("/api/v1/admin/users/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(typeof res.body).toBe("object");
        });
    });
  });
});
