import UseCase from "../../shared/useCases/useCase";
import { Role, User } from "../../users/api";
import Logbook from "../entities/logbook";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";

interface GetLogbooksDTO {
  userId: string;
  user: User;
}

export interface GetLogbooks
  extends UseCase<GetLogbooksDTO, Promise<Logbook[]>> {
  execute: (getLogbooksDTO: GetLogbooksDTO) => Promise<Logbook[]>;
}

export class GetLogbooksImpl implements GetLogbooks {
  constructor(private logbookRepo: LogbookRepo) {}

  async execute(getLogbooksDTO: GetLogbooksDTO): Promise<Logbook[]> {
    const { userId, user } = getLogbooksDTO;

    let includePrivateLogbooks = false;
    const isOwner = user.id === userId;
    const isAdmin = user.role === Role.ADMIN;

    if (isOwner || isAdmin) {
      includePrivateLogbooks = true;
    }

    const logbooks = this.logbookRepo.getLogbooksByUserId(userId, {
      includePrivateLogbooks,
    });
    return logbooks;
  }
}
