import { Tenant } from "@/entity/tenant";
import { Repository } from "typeorm";
import { TenantData, TenantSearchQueryParams } from "@/types";
import createHttpError from "http-errors";

class TenantService {
  private tenantRepository: Repository<Tenant>;

  constructor(tenantRepository: Repository<Tenant>) {
    this.tenantRepository = tenantRepository;
  }

  async create({ name, address }: TenantData) {
    try {
      const tenent = await this.tenantRepository.save({ name, address });
      return tenent;
    } catch (error) {
      const err = createHttpError(500, String(error));
      throw err;
    }
  }

  async findAll(searchQueryParams: TenantSearchQueryParams) {
    const { page, limit } = searchQueryParams;
    try {
      const queryBuilder = this.tenantRepository.createQueryBuilder();
      const tenents = queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
      return tenents;
    } catch (error) {
      const err = createHttpError(500, String(error));
      throw err;
    }
  }

  async findOne(tenantId: number) {
    try {
      const tenent = await this.tenantRepository.find({
        where: { id: tenantId },
      });
      return tenent;
    } catch (error) {
      const err = createHttpError(500, String(error));
      throw err;
    }
  }

  async remove(tenantId: number) {
    try {
      const tenent = await this.tenantRepository.delete({ id: tenantId });
      return tenent;
    } catch (error) {
      const err = createHttpError(500, String(error));
      throw err;
    }
  }

  async update(tenantId: number, data: TenantData) {
    try {
      const tenent = await this.tenantRepository.update({ id: tenantId }, data);
      return tenent;
    } catch (error) {
      const err = createHttpError(500, String(error));
      throw err;
    }
  }
}

export { TenantService };
