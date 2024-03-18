import { TenantService } from "@/services/tenant.service";
import { AuthenticatedRequest, TenantData } from "@/types";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { Logger } from "winston";

interface TenantCreateRequest extends AuthenticatedRequest {
  body: TenantData;
}

class TenantController {
  private tenantService: TenantService;
  private logger: Logger;

  constructor(tenantService: TenantService, logger: Logger) {
    this.tenantService = tenantService;
    this.logger = logger;
  }

  async create(req: TenantCreateRequest, res: Response, next: NextFunction) {
    this.logger.debug("New Request to create tenant");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, address } = req.body;

    try {
      this.logger.info("creating new tenant..!");
      const tenant = await this.tenantService.create({ name, address });
      this.logger.info("created new tenant..!");
      return res.status(201).json(tenant);
    } catch (error) {
      return next(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async indexAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenants = await this.tenantService.findAll();
      return res.json(tenants);
    } catch (error) {
      return next(error);
    }
  }
}

export { TenantController };
