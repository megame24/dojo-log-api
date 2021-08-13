import User from "../entities/user";
import AppError from "../../shared/core/AppError";
import { SecurityService } from "../infrastructure/services/securityService";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { UseCase } from "../../shared/core/types";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
  name: string;
}

interface ReturnValue {
  user: User;
  authToken: string;
}

export interface RegisterUserViaEmail
  extends UseCase<RegisterUserDTO, Promise<ReturnValue>> {
  execute: (registerUserDTO: RegisterUserDTO) => Promise<ReturnValue>;
}

export class RegisterUserViaEmailImpl implements RegisterUserViaEmail {
  constructor(
    private securityService: SecurityService,
    private uuidService: UUIDService,
    private userRepo: UserRepo
  ) {}

  async execute(registerUserDTO: RegisterUserDTO): Promise<ReturnValue> {
    const emailExists = await this.userRepo.emailExists(registerUserDTO.email);
    if (emailExists) {
      throw AppError.badRequestError("User with that email already exists");
    }
    const usernameExists = await this.userRepo.usernameExists(
      registerUserDTO.username
    );
    if (usernameExists) {
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

    const authToken = this.securityService.generateToken({
      id: user.id,
      username: user.username,
    });
    return { user, authToken };
  }
}
