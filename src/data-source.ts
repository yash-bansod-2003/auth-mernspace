import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entity/user";
import { CONFIG } from "@/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: CONFIG.DATABASE_HOST,
  port: Number(CONFIG.DATABASE_PORT),
  username: CONFIG.DATABASE_USERNAME,
  password: CONFIG.DATABASE_PASSWORD,
  database: CONFIG.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
