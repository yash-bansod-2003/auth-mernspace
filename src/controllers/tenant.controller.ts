import { TenantService } from "@/services/tenant.service";
import {
  AuthenticatedRequest,
  TenantData,
  TenantSearchQueryParams,
} from "@/types";
import { NextFunction, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";

interface TenantCreateRequest extends AuthenticatedRequest {
  body: TenantData;
}

export interface TenantWithParams extends TenantCreateRequest {
  body: TenantData;
  params: {
    tenantId: string;
  };
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

  async indexAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const searchQueryParams = matchedData(req, {
      onlyValidData: true,
    }) as TenantSearchQueryParams;
    const { page, limit } = searchQueryParams;
    try {
      const tenants = await this.tenantService.findAll(searchQueryParams);
      return res.json({
        page,
        limit,
        count: tenants.length,
        data: tenants,
      });
    } catch (error) {
      return next(error);
    }
  }

  async indexOne(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenant = await this.tenantService.findOne(
        Number(req.params.tenantId),
      );
      return res.json(tenant);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: TenantWithParams, res: Response, next: NextFunction) {
    this.logger.debug("New Request to update tenant");

    const tenantId = req.params.tenantId;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (isNaN(Number(tenantId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    const { name, address } = req.body;

    try {
      this.logger.info("updating tenant..!");
      const tenant = await this.tenantService.update(Number(tenantId), {
        name,
        address,
      });
      this.logger.info("updated tenant..!");
      return res.status(200).json(tenant);
    } catch (error) {
      return next(error);
    }
  }

  async destroy(req: TenantWithParams, res: Response, next: NextFunction) {
    this.logger.debug("New Request to delete tenant");

    const tenantId = req.params.tenantId;

    if (isNaN(Number(tenantId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    try {
      this.logger.info("deleting tenant..!");
      const tenant = await this.tenantService.remove(Number(tenantId));
      this.logger.info("deleted tenant..!");
      return res.status(200).json(tenant);
    } catch (error) {
      return next(error);
    }
  }
}

export { TenantController };
