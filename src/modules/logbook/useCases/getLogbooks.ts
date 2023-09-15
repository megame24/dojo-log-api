import UseCase from "../../shared/useCases/useCase";
import User, { Role } from "../../users/entities/user";
import Logbook from "../entities/logbook";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";
import { GetLogbook } from "./getLogbook";

interface GetLogbooksDTO {
  userId: string;
  user: User;
  startDate: Date;
  endDate: Date;
}

export interface GetLogbooks
  extends UseCase<GetLogbooksDTO, Promise<Logbook[]>> {
  execute: (getLogbooksDTO: GetLogbooksDTO) => Promise<Logbook[]>;
}

export class GetLogbooksImpl implements GetLogbooks {
  constructor(
    private logbookRepo: LogbookRepo,
    private getLogbook: GetLogbook
  ) {}

  async execute(getLogbooksDTO: GetLogbooksDTO): Promise<Logbook[]> {
    const { userId, user, startDate, endDate } = getLogbooksDTO;

    let includePrivateLogbooks = false;
    const isOwner = user.id === userId;
    const isAdmin = user.role === Role.ADMIN;

    if (isOwner || isAdmin) {
      includePrivateLogbooks = true;
    }

    const lightLogbooks = await this.logbookRepo.getLightLogbooksByUserId(
      userId,
      {
        includePrivateLogbooks,
      }
    );

    const logbookPromise: any = lightLogbooks.map((lightLogbook) => {
      return this.getLogbook.execute({
        logbookId: <string>lightLogbook.id,
        startDate,
        endDate,
      });
    });

    let logbooks: Logbook[] = await Promise.all(logbookPromise);
    logbooks = logbooks.sort((a: Logbook, b: Logbook) => {
      return (
        Number(new Date(<Date>b.updatedAt)) -
        Number(new Date(<Date>a.updatedAt))
      );
    });

    return logbooks;
  }
}
