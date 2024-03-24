import { AppDataSource } from "@/data-source";
import { createServer } from "@/server";
import supertest from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import { User } from "@/entity/user";
import { UserRoles } from "@/constants";
import { UserData } from "@/types";

describe("user create", () => {
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

  describe("post /api/user", () => {
    const userData: UserData = {
      firstName: "yash",
      lastName: "bansod",
      email: "test@example.com",
      password: "secret",
      role: UserRoles.MANAGER,
      tenantId: 1,
    };

    it("should return status 201", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      await supertest(createServer())
        .post("/api/user")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(userData)
        .expect(201)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should persist user in database", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      await supertest(createServer())
        .post("/api/user")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(userData)
        .expect(201);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
      expect(users[0].role).toBe(userData.role);
    });

    it("should return status 403 (Forbidden) if user is not admin", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.CUSTOMER });

      await supertest(createServer())
        .post("/api/user")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(userData)
        .expect(403);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(0);
    });

    it("should return status 401 if token does not exists", async () => {
      await supertest(createServer())
        .post("/api/user")
        .send(userData)
        .expect(401);
    });
  });
});
