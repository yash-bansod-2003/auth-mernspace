import { User } from "@/entity/user";
import { Repository } from "typeorm";
import { UserData, UserSearchQueryParams } from "@/types";
import createHttpError from "http-errors";
import { UserRoles } from "@/constants";
import bcrypt from "bcryptjs";

class AuthService {
  constructor(private userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async create({
    firstName,
    lastName,
    email,
    password,
    role,
    tenantId,
  }: UserData) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      const error = createHttpError(409, "email already exists");
      throw error;
    }

    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || UserRoles.CUSTOMER,
        tenantId,
      });
    } catch (err) {
      const error = createHttpError(500, String(err));
      throw error;
    }
  }

  async login({ email, password }: Pick<UserData, "email" | "password">) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      const error = createHttpError(404, "user not found");
      throw error;
    }

    try {
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = createHttpError(500, "wrong credentials");
        throw error;
      }

      return user;
    } catch (err) {
      const error = createHttpError(500, "failed to store data in database");
      throw error;
    }
  }

  async me({ userId }: { userId: number }) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { tenant: true },
      });

      return user;
    } catch (err) {
      const error = createHttpError(500);
      throw error;
    }
  }

  async getAll(searchQueryParams: UserSearchQueryParams) {
    try {
      const { page, limit } = searchQueryParams;
      const queryBuilder = this.userRepository.createQueryBuilder();
      const users = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return users;
    } catch (err) {
      const error = createHttpError(500);
      throw error;
    }
  }

  async update(userId: number, data: UserData) {
    try {
      const user = await this.userRepository.update({ id: userId }, data);

      return user;
    } catch (err) {
      const error = createHttpError(500);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.delete({ id });

      return user;
    } catch (err) {
      const error = createHttpError(500);
      throw error;
    }
  }
}

export { AuthService };
