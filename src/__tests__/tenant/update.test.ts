import { AppDataSource } from "@/data-source";
import { createServer } from "@/server";
import supertest from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import { Tenant } from "@/entity/tenant";
import { UserRoles } from "@/constants";

describe("tenent create", () => {
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

  describe("patch /api/tenant/:id", () => {
    const tenantData = {
      name: "Tenant Name",
      address: "Tenant Address",
    };
    const newTenantData = {
      name: "New Tenant Name",
      address: "New Tenant Address",
    };
    it("should return status 200", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const tenantRepository = connection.getRepository(Tenant);
      await tenantRepository.save(tenantData);

      await supertest(createServer())
        .patch("/api/tenant/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(newTenantData)
        .expect(200)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should update tenant in database", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const tenantRepository = connection.getRepository(Tenant);
      await tenantRepository.save(tenantData);

      await supertest(createServer())
        .patch("/api/tenant/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(newTenantData)
        .expect(200);

      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(newTenantData.name);
      expect(tenants[0].address).toBe(newTenantData.address);
    });

    it("should return status 401 (Unauthorized) if user is not authenticated", async () => {
      const tenantRepository = connection.getRepository(Tenant);
      await tenantRepository.save(tenantData);

      await supertest(createServer())
        .patch("/api/tenant/1")
        .send(newTenantData)
        .expect(401);

      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });

    it.skip("should return status 403 (Forbidden) if user is not admin", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.CUSTOMER });

      const tenantRepository = connection.getRepository(Tenant);
      await tenantRepository.save(tenantData);

      await supertest(createServer())
        .patch("/api/tenant/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(newTenantData)
        .expect(403);

      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });

    it.skip("should return 422 (Unprocessable Entity) if name filed is missing", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const tenantData = {
        address: "Tenant Address",
      };

      await supertest(createServer())
        .post("/api/tenant")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(tenantData)
        .expect(422);

      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(0);
    });

    it.skip("should return 422 (Unprocessable Entity) if address filed is missing", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const tenantData = {
        name: "Tenant Name",
      };

      await supertest(createServer())
        .post("/api/tenant")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(tenantData)
        .expect(422);

      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(0);
    });
  });
});
