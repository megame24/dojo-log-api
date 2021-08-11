import AppError from "../../shared/core/AppError";
import { UseCase } from "../../shared/core/types";
import User from "../entities/user";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface AuthenticateUserDTO {
  token: string;
}

export interface AuthenticateUser
  extends UseCase<AuthenticateUserDTO, Promise<User>> {
  execute: (authenticateUserDTO: AuthenticateUserDTO) => Promise<User>;
}

export class AuthenticateUserImpl implements AuthenticateUser {
  constructor(
    private userRepo: UserRepo,
    private securityService: SecurityService
  ) {}

  async execute(authenticateUserDTO: AuthenticateUserDTO): Promise<User> {
    const { token } = authenticateUserDTO;

    const validToken = this.securityService.verifyToken(token);
    if (!validToken) throw AppError.badRequestError("Invalid token");
    const { id } = validToken;

    const user = await this.userRepo.getUserById(id);
    if (!user) throw AppError.unauthorizedError("Authentication failed");

    return user;
  }
}
