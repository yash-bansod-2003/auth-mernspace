import { User } from "@/entity/user";
import { Repository } from "typeorm";
import { UserData } from "@/types";
import createHttpError from "http-errors";

class AuthService {
  constructor(private userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async create({ firstName, lastName, email, password, role }: UserData) {
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
        role,
      });
    } catch (err) {
      const error = createHttpError(500, "failed to store data in database");
      throw error;
    }
  }
}

export { AuthService };
