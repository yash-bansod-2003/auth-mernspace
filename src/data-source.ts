import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { RefreshToken } from "./entity/refresh-token";
import { Tenant } from "./entity/tenant";
import { CONFIG } from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: CONFIG.DATABASE_HOST,
  port: Number(CONFIG.DATABASE_PORT),
  username: CONFIG.DATABASE_USERNAME,
  password: CONFIG.DATABASE_PASSWORD,
  database: CONFIG.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: [User, RefreshToken, Tenant],
  migrations: ["src/migration/*.{ts,js}"],
  subscribers: [],
});
