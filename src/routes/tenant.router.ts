import express, { Request, Response, NextFunction } from "express";
import { TenantController } from "@/controllers/tenant.controller";
import { AppDataSource } from "@/data-source";
import { Tenant } from "@/entity/tenant";
import { TenantService } from "@/services/tenant.service";
import { AuthenticatedRequest } from "@/types";

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService);

router.post("/tenant", (req: Request, res: Response, next: NextFunction) => {
  tenantController.create(req as AuthenticatedRequest, res, next);
});

export { router as tenantRouter };
