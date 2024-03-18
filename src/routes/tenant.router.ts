import express, { Request, Response, NextFunction } from "express";
import { TenantController } from "@/controllers/tenant.controller";
import { AppDataSource } from "@/data-source";
import { Tenant } from "@/entity/tenant";
import { TenantService } from "@/services/tenant.service";
import { AuthenticatedRequest } from "@/types";
import { tenentCreateValidator } from "@/lib/validators/tenant";
import { logger } from "@/config/logger";
import authenticate from "@/middlewares/authenticate";
import { canAccess } from "@/middlewares/can-access";
import { UserRoles } from "@/constants";

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post(
  "/tenant",
  tenentCreateValidator,
  authenticate,
  canAccess([UserRoles.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    await tenantController.create(req as AuthenticatedRequest, res, next);
  },
);

router.get(
  "/tenant",
  authenticate,
  canAccess([UserRoles.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    await tenantController.indexAll(req as AuthenticatedRequest, res, next);
  },
);

router.get(
  "/tenant/:id",
  authenticate,
  canAccess([UserRoles.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    await tenantController.indexOne(req as AuthenticatedRequest, res, next);
  },
);

export { router as tenantRouter };
