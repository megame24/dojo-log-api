import User from "../entities/user";
import { SecurityService } from "../infrastructure/services/securityService";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import AppError from "../../shared/AppError";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";

interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface RegisterUser extends UseCase<RegisterUserDTO, Promise<User>> {
  execute: (registerUserDTO: RegisterUserDTO) => Promise<User>;
}

export class RegisterUserImpl implements RegisterUser {
  constructor(
    private securityService: SecurityService,
    private uuidService: UUIDService,
    private userRepo: UserRepo
  ) {}

  async execute(registerUserDTO: RegisterUserDTO): Promise<User> {
    const userWithSameEmail = await this.userRepo.getUserByEmail(
      registerUserDTO.email
    );
    if (userWithSameEmail) {
      throw AppError.badRequestError("User with that email already exists");
    }
    const userWithSameUsername = await this.userRepo.getUserByUsername(
      registerUserDTO.username
    );
    if (userWithSameUsername) {
      throw AppError.badRequestError("User with that username already exists");
    }

    const createUserProps = {
      ...registerUserDTO,
      isPasswordHashed: false,
      isPasswordRequired: true,
    };
    const user = await User.create(
      createUserProps,
      this.securityService,
      this.uuidService
    );
    await this.userRepo.create(user);

    return user;
  }
}
