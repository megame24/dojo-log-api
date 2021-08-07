import User from "../entities/user";
import AppError from "../../shared/core/AppError";
import { SecurityService } from "../infrastructure/services/securityService";
import { UUIDService } from "../infrastructure/services/uuidService";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { UseCase } from "../../shared/core/types";
import { EmailService } from "../../shared/infrastructure/services/emailService";

export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface RegisterUserViaEmail extends UseCase<RegisterUserDTO, void> {
  execute: (registerUserDTO: RegisterUserDTO) => Promise<string>;
}

export class RegisterUserViaEmailImpl implements RegisterUserViaEmail {
  constructor(
    private securityService: SecurityService,
    private uuidService: UUIDService,
    private userRepo: UserRepo,
    private emailService: EmailService
  ) {}

  async execute(registerUserDTO: RegisterUserDTO): Promise<string> {
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

    const user = await User.create(
      registerUserDTO,
      this.securityService,
      this.uuidService
    );

    await this.userRepo.create({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      password: user.password,
      role: user.role,
      verified: user.verified,
    });

    await this.emailService.sendWelcomeEmail(user.email);

    const authToken = this.securityService.generateToken({
      id: user.id,
      username: user.username,
    });
    return authToken;
  }
}
