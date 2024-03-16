import { User } from "@/entity/user";
import { Repository } from "typeorm";
import { UserData } from "@/types";
import createHttpError from "http-errors";
import { UserRoles } from "@/constants";
import bcrypt from "bcrypt";

class AuthService {
  constructor(private userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async create({ firstName, lastName, email, password }: UserData) {
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
        role: UserRoles.CUSTOMER,
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

  async me({ id }: { id: number }) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      return user;
    } catch (err) {
      const error = createHttpError(500);
      throw error;
    }
  }
}

export { AuthService };
