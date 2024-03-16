import { UserRoles } from "../constants";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Tenant } from "./tenant";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: UserRoles.CUSTOMER })
  role: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;
}
