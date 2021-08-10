import AppError from "../../shared/core/AppError";
import { SecurityService } from "../infrastructure/services/securityService";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { UseCase } from "../../shared/core/types";

interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LoginUserViaEmail
  extends UseCase<LoginUserDTO, Promise<string>> {
  execute: (loginUserDTO: LoginUserDTO) => Promise<string>;
}

export class LoginUserViaEmailImpl implements LoginUserViaEmail {
  constructor(
    private securityService: SecurityService,
    private userRepo: UserRepo
  ) {}

  async execute(loginUserDTO: LoginUserDTO): Promise<string> {
    const user = await this.userRepo.getUserByEmail(loginUserDTO.email, {
      includePassword: true,
    });
    if (!user) throw AppError.unauthorizedError("Authentication failed");

    const passwordMatch = await this.securityService.compare(
      loginUserDTO.password,
      <string>user.password
    );
    if (!passwordMatch)
      throw AppError.unauthorizedError("Authentication failed");

    const authToken = this.securityService.generateToken({
      id: user.id,
      username: user.username,
    });
    return authToken;
  }
}
