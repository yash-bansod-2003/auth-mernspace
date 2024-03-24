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

  describe("patch /api/user/1", () => {
    const userData: UserData = {
      firstName: "yash",
      lastName: "bansod",
      email: "test@example.com",
      password: "secret",
      role: UserRoles.MANAGER,
      tenantId: 1,
    };

    const newUserData: UserData = {
      firstName: "New yash",
      lastName: "New bansod",
      email: "New test@example.com",
      password: "New secret",
      role: UserRoles.ADMIN,
      tenantId: 1,
    };

    it("should return status 200", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      await supertest(createServer())
        .patch("/api/user/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(newUserData)
        .expect(200)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should update user in database", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      await supertest(createServer())
        .patch("/api/user/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(newUserData)
        .expect(200);

      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(newUserData.firstName);
      expect(users[0].lastName).toBe(newUserData.lastName);
      expect(users[0].email).toBe(newUserData.email);
      expect(users[0].role).toBe(newUserData.role);
    });

    it("should return status 403 (Forbidden) if user is not admin", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.CUSTOMER });

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      await supertest(createServer())
        .post("/api/user")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(userData)
        .expect(403);

      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
      expect(users[0].role).toBe(userData.role);
    });

    it("should return status 401 if token does not exists", async () => {
      await supertest(createServer())
        .post("/api/user")
        .send(newUserData)
        .expect(401);
    });
  });
});
