import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import { PersistentTokenRepo } from "../infrastructure/repositories/persistentTokenRepo";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface VerifyUserDTO {
  userId: string;
  token: string;
}

export interface VerifyUser extends UseCase<VerifyUserDTO, void> {
  execute: (verifyUserDTO: VerifyUserDTO) => void;
}

export class VerifyUserImpl implements VerifyUser {
  constructor(
    private userRepo: UserRepo,
    private persistentTokenRepo: PersistentTokenRepo,
    private securityService: SecurityService
  ) {}

  async execute(verifyUserDTO: VerifyUserDTO) {
    const { token, userId } = verifyUserDTO;

    const validToken = this.securityService.verifyToken(token);
    if (!validToken) throw AppError.badRequestError("Invalid token");

    const verificationToken =
      await this.persistentTokenRepo.getByUserIdAndToken(userId, token);
    if (!verificationToken) throw AppError.unauthorizedError();

    const user = await this.userRepo.getUserById(userId);
    if (!user) throw AppError.notFoundError("User not found");

    await this.userRepo.update(user, { verified: true });
    await this.persistentTokenRepo.deleteOne(verificationToken);
  }
}
