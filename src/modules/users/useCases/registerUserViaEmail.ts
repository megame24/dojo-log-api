import User, { CreateUserProps } from "../entities/user";
import AppError from "../../shared/core/AppError";
import { SecurityService } from "../infrastructure/services/securityService";
import { UUIDService } from "../infrastructure/services/uuidService";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { UseCase } from "../../shared/core/types";
import { EmailService } from "../../shared/infrastructure/services/emailService";
import PersistentToken, {
  PersistentTokenProps,
} from "../entities/persistentToken";
import { PersistentTokenRepo } from "../infrastructure/repositories/persistentTokenRepo";

export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface RegisterUserViaEmail
  extends UseCase<RegisterUserDTO, Promise<string>> {
  execute: (registerUserDTO: RegisterUserDTO) => Promise<string>;
}

export class RegisterUserViaEmailImpl implements RegisterUserViaEmail {
  constructor(
    private securityService: SecurityService,
    private uuidService: UUIDService,
    private userRepo: UserRepo,
    private emailService: EmailService,
    private persistentTokenRepo: PersistentTokenRepo
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

    const createUserProps: CreateUserProps = {
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

    const persistentTokenProps: PersistentTokenProps = {
      userId: <string>user.id,
    };
    const verificationToken = PersistentToken.create(
      persistentTokenProps,
      this.securityService
    );
    await this.persistentTokenRepo.create(verificationToken);

    // explore moving this out of here and triggering something to call this!!!!!
    // like a notification domain use case that kicks off after create
    await this.emailService.sendVerificationMail(user.email, verificationToken);

    const authToken = this.securityService.generateToken({
      id: user.id,
      username: user.username,
    });
    return authToken;
  }
}
