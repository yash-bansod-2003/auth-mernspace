import { User } from "@/entity/user";
import { Repository } from "typeorm";
import { UserData } from "@/types";

class AuthService {
  constructor(private userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async create({ firstName, lastName, email, password }: UserData) {
    return await this.userRepository.save({
      firstName,
      lastName,
      email,
      password,
    });
  }
}

export { AuthService };
