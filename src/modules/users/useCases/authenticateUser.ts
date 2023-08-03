import AppError from "../../shared/AppError";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import User, { Role } from "../entities/user";
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
    private securityService: SecurityService,
    private uuidService: UUIDService
  ) {}

  async execute(authenticateUserDTO: AuthenticateUserDTO): Promise<User> {
    const { token } = authenticateUserDTO;

    if (!token) {
      const dateString = new Date().toISOString();
      const guestUserProps = {
        name: "Guest User",
        email: "guestuser@dojolog.api",
        username: dateString,
        role: Role.GUEST,
        isPasswordHashed: false,
        isPasswordRequired: false,
        verified: true,
      };
      const guestUser = User.create(
        guestUserProps,
        this.securityService,
        this.uuidService
      );
      return guestUser;
    }

    const validToken = this.securityService.verifyToken(token);
    if (!validToken) throw AppError.badRequestError("Invalid token");
    const { id } = validToken;

    const user = await this.userRepo.getUserById(id);
    if (!user) throw AppError.unauthorizedError("Authentication failed");

    return user;
  }
}
