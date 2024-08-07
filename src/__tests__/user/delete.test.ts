import { AppDataSource } from "@/data-source";
import { createServer } from "@/server";
import supertest from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import { User } from "@/entity/user";
import { UserRoles } from "@/constants";
import { UserData } from "@/types";

describe("Admin Delete User", () => {
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

  describe("delete /api/v1/admin/users/:userId", () => {
    const userData: UserData = {
      firstName: "yash",
      lastName: "bansod",
      email: "test@example.com",
      password: "secret",
      role: UserRoles.MANAGER,
      tenantId: 1,
    };

    it("should return status 200", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      await supertest(createServer())
        .delete("/api/v1/admin/users/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should delete user in database", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      await supertest(createServer())
        .delete("/api/v1/admin/users/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200);

      const users = await userRepository.find();

      expect(users).toHaveLength(0);
    });

    it("should return status 403 (Forbidden) if user is not admin", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.CUSTOMER });

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      await supertest(createServer())
        .delete("/api/v1/admin/users/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(403);

      const users = await userRepository.find();

      expect(users).toHaveLength(1);
    });

    it("should return status 401 if token does not exists", async () => {
      await supertest(createServer())
        .delete("/api/v1/admin/users/1")
        .expect(401);
    });
  });
});
