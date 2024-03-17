import { TenantService } from "@/services/tenant.service";
import { AuthenticatedRequest } from "@/types";
import { NextFunction, Response } from "express";

class TenantController {
  private tenantService: TenantService;

  constructor(tenantService: TenantService) {
    this.tenantService = tenantService;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    return res.status(201).json();
  }
}

export { TenantController };
