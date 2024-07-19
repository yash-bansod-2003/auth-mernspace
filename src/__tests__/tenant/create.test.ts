import { AppDataSource } from "@/data-source";
import { createServer } from "@/server";
import supertest from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import { Tenant } from "@/entity/tenant";
import { UserRoles } from "@/constants";

describe("Tenant Create", () => {
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

  describe("post /api/v1/tenants", () => {
    it("should return status 201", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const tenantData = {
        name: "Tenant Name",
        address: "Tenant Address",
      };

      await supertest(createServer())
        .post("/api/v1/tenants")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(tenantData)
        .expect(201)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should save tenant in database", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const tenantData = {
        name: "Tenant Name",
        address: "Tenant Address",
      };

      await supertest(createServer())
        .post("/api/v1/tenants")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(tenantData)
        .expect(201);

      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });

    it("should return status 401 (Unauthorized) if user is not authenticated", async () => {
      const tenantData = {
        name: "Tenant Name",
        address: "Tenant Address",
      };

      await supertest(createServer())
        .post("/api/v1/tenants")
        .send(tenantData)
        .expect(401);

      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(0);
    });

    it("should return status 403 (Forbidden) if user is not admin", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.CUSTOMER });

      const tenantData = {
        name: "Tenant Name",
        address: "Tenant Address",
      };

      await supertest(createServer())
        .post("/api/v1/tenants")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(tenantData)
        .expect(403);

      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(0);
    });

    it("should return 422 (Unprocessable Entity) if name filed is missing", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const tenantData = {
        address: "Tenant Address",
      };

      await supertest(createServer())
        .post("/api/v1/tenants")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(tenantData)
        .expect(422);

      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(0);
    });

    it("should return 422 (Unprocessable Entity) if address filed is missing", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const tenantData = {
        name: "Tenant Name",
      };

      await supertest(createServer())
        .post("/api/v1/tenants")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(tenantData)
        .expect(422);

      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(0);
    });
  });
});
