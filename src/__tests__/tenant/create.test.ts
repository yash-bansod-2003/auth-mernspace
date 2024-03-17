import { AppDataSource } from "@/data-source";
import { createServer } from "@/server";
import supertest from "supertest";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import { Tenant } from "@/entity/tenant";

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

  describe("post /api/tenant", () => {
    it("should return status 201", async () => {
      const tenantData = {
        name: "Tenant Name",
        address: "Tenant Address",
      };

      await supertest(createServer())
        .post("/api/tenant")
        .send(tenantData)
        .expect(201)
        .then((res) => {
          expect(res.ok).toBe(true);
        });
    });

    it("should save tenant in database", async () => {
      const tenantData = {
        name: "Tenant Name",
        address: "Tenant Address",
      };

      await supertest(createServer())
        .post("/api/tenant")
        .send(tenantData)
        .expect(201);

      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });
  });
});
