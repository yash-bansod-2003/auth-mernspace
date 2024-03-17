import { TenantService } from "@/services/tenant.service";
import { AuthenticatedRequest, TenantData } from "@/types";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";

interface TenantCreateRequest extends AuthenticatedRequest {
  body: TenantData;
}

class TenantController {
  private tenantService: TenantService;

  constructor(tenantService: TenantService) {
    this.tenantService = tenantService;
  }

  async create(req: TenantCreateRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, address } = req.body;

    try {
      const tenant = await this.tenantService.create({ name, address });
      return res.status(201).json(tenant);
    } catch (error) {
      return next(error);
    }
  }
}

export { TenantController };
