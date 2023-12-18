import { Visibility } from "../../logbook/entities/logbook";
import { FileService } from "../../shared/infrastructure/services/fileService";
import UseCase from "../../shared/useCases/useCase";
import User from "../entities/user";
import { UserRepo } from "../infrastructure/repositories/userRepository";

interface DeleteAccountDTO {
  user: User;
}

export interface DeleteAccount extends UseCase<DeleteAccountDTO, void> {
  execute: (deleteAccountDTO: DeleteAccountDTO) => void;
}

export class DeleteAccountImpl implements DeleteAccount {
  constructor(private userRepo: UserRepo, private fileService: FileService) {}

  async execute(deleteAccountDTO: DeleteAccountDTO) {
    const { user } = deleteAccountDTO;

    await this.userRepo.delete(user);
    await this.fileService.deleteAllUserFiles(
      <string>user.id,
      Visibility.private
    );
    await this.fileService.deleteAllUserFiles(
      <string>user.id,
      Visibility.public
    );
  }
}
