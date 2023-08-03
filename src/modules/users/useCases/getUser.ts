import { UserRepo } from "../infrastructure/repositories/userRepository";
import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import User from "../entities/user";

interface GetUserDTO {
  userId: string;
}

export interface GetUser extends UseCase<GetUserDTO, Promise<User>> {
  execute: (getUserDTO: GetUserDTO) => Promise<User>;
}

export class GetUserImpl implements GetUser {
  constructor(private userRepo: UserRepo) {}

  async execute(getUserDTO: GetUserDTO): Promise<User> {
    const user = await this.userRepo.getUserById(getUserDTO.userId);
    if (!user) throw AppError.notFoundError("User not found");

    return user;
  }
}
