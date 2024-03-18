import { Tenant } from "@/entity/tenant";
import { Repository } from "typeorm";
import { TenantData } from "@/types";
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

  async findAll() {
    try {
      const tenents = await this.tenantRepository.find();
      return tenents;
    } catch (error) {
      const err = createHttpError(500, String(error));
      throw err;
    }
  }
}

export { TenantService };
