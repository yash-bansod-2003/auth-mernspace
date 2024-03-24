import { AppDataSource } from "@/data-source";
import { createServer } from "@/server";
import supertest from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import { Tenant } from "@/entity/tenant";
import { UserRoles } from "@/constants";

describe("tenent delete", () => {
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

  describe("delete /api/tenant/:id", () => {
    const tenantData = {
      name: "Tenant Name",
      address: "Tenant Address",
    };

    it("should return status 200", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const tenantRepository = connection.getRepository(Tenant);
      await tenantRepository.save(tenantData);

      await supertest(createServer())
        .delete("/api/tenant/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should delete tenant in database", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

      const tenantRepository = connection.getRepository(Tenant);
      await tenantRepository.save(tenantData);

      await supertest(createServer())
        .delete("/api/tenant/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(200);

      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(0);
    });

    it("should return status 401 (Unauthorized) if user is not authenticated", async () => {
      const tenantRepository = connection.getRepository(Tenant);
      await tenantRepository.save(tenantData);

      await supertest(createServer()).delete("/api/tenant/1").expect(401);

      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(1);
    });

    it.skip("should return status 403 (Forbidden) if user is not admin", async () => {
      const accessToken = jwks.token({ sub: "1", role: UserRoles.CUSTOMER });

      const tenantRepository = connection.getRepository(Tenant);
      await tenantRepository.save(tenantData);

      await supertest(createServer())
        .delete("/api/tenant/1")
        .set("Cookie", [`accessToken=${accessToken}`])
        .expect(403);

      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });
  });
});
