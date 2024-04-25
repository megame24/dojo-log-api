import AppError from "../../shared/AppError";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import User, { Role } from "../entities/user";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface AuthenticateUserDTO {
  token?: string;
  incomingHmac?: string;
  queryParams: string;
}

export interface AuthenticateUser
  extends UseCase<AuthenticateUserDTO, Promise<User>> {
  execute: (authenticateUserDTO: AuthenticateUserDTO) => Promise<User>;
}

export class AuthenticateUserImpl implements AuthenticateUser {
  constructor(
    private userRepo: UserRepo,
    private securityService: SecurityService,
    private uuidService: UUIDService,
    private crypto: any
  ) {}

  generateTempUser(name: string, email: string, role: Role) {
    const dateString = new Date().toISOString();
    const tempUserProps = {
      name,
      email,
      username: dateString,
      role,
      isPasswordHashed: false,
      isPasswordRequired: false,
      verified: true,
    };
    return User.create(tempUserProps, this.securityService, this.uuidService);
  }
  canonicalizeQueryParams(params: any) {
    // Sort parameters alphabetically and format them as a string
    return Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
  }

  async execute(authenticateUserDTO: AuthenticateUserDTO): Promise<User> {
    const { token, incomingHmac, queryParams } = authenticateUserDTO;

    if (incomingHmac) {
      const hmacData = `${this.canonicalizeQueryParams(queryParams)}`;
      const computedHmac = this.crypto
        .createHmac("sha256", process.env.HMAC_SECRETE)
        .update(hmacData)
        .digest("hex");
      if (computedHmac === incomingHmac) {
        const botUser = this.generateTempUser(
          "Bot User",
          "botuser@dojolog.api",
          Role.BOT
        );
        return botUser;
      } else {
        throw AppError.unauthorizedError("Authentication failed");
      }
    }
    if (!token) {
      const guestUser = this.generateTempUser(
        "Guest User",
        "guestuser@dojolog.api",
        Role.GUEST
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
