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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: UserRoles.CUSTOMER,
      });
    } catch (err) {
      const error = createHttpError(500, "failed to store data in database");
      throw error;
    }
  }
}

export { AuthService };
