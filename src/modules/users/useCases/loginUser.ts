import { SecurityService } from "../infrastructure/services/securityService";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";

interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LoginUser extends UseCase<LoginUserDTO, Promise<string>> {
  execute: (loginUserDTO: LoginUserDTO) => Promise<string>;
}

export class LoginUserImpl implements LoginUser {
  constructor(
    private securityService: SecurityService,
    private userRepo: UserRepo
  ) {}

  async execute(loginUserDTO: LoginUserDTO): Promise<string> {
    const user = await this.userRepo.getUserByEmail(loginUserDTO.email, {
      includePassword: true,
    });
    if (!user) throw AppError.unauthorizedError("Authentication failed");

    const passwordMatch = await this.securityService.compareHash(
      loginUserDTO.password,
      <string>user.password
    );
    if (!passwordMatch)
      throw AppError.unauthorizedError("Authentication failed");

    const authToken = this.securityService.generateToken({
      id: user.id,
      username: user.username,
      verified: user.verified,
      role: user.role,
      name: user.name,
      email: user.email,
      expoNotificationTokens: user.expoNotificationTokens,
    });
    return authToken;
  }
}
