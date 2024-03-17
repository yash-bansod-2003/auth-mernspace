import { Tenant } from "@/entity/tenant";
import { Repository } from "typeorm";

class TenantService {
  private tenantRepository: Repository<Tenant>;

  constructor(tenantRepository: Repository<Tenant>) {
    this.tenantRepository = tenantRepository;
  }

  create() {}
}

export { TenantService };
