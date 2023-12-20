import AppError from "../../shared/AppError";
import { DateService } from "../../shared/infrastructure/services/dateService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Logbook from "../entities/logbook";
import { GoalRepo } from "../infrastructure/repositories/goalRepo";
import { LogRepo } from "../infrastructure/repositories/logRepo";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";

interface GetLogbookDTO {
  logbookId: string;
  startDate: Date;
  endDate: Date;
  year?: string;
}

export interface GetLogbook extends UseCase<GetLogbookDTO, Promise<Logbook>> {
  execute: (getLogbookDTO: GetLogbookDTO) => Promise<Logbook>;
}

export class GetLogbookImpl implements GetLogbook {
  constructor(
    private logbookRepo: LogbookRepo,
    private goalRepo: GoalRepo,
    private logRepo: LogRepo,
    private uuidService: UUIDService,
    private dateService: DateService
  ) {}

  async execute(getLogbookDTO: GetLogbookDTO): Promise<Logbook> {
    const { logbookId, startDate, endDate, year } = getLogbookDTO;

    if (!startDate || !endDate) {
      throw AppError.badRequestError("start and end dates required");
    }

    const goals = await this.goalRepo.getGoalsByLogbookIdStartAndEndDates(
      logbookId,
      startDate,
      endDate
    );

    const logs = await this.logRepo.getLogsByLogbookIdStartAndEndDates(
      logbookId,
      startDate,
      endDate
    );

    const lightLogbook = await this.logbookRepo.getLiteLogbookById(logbookId);
    if (!lightLogbook) throw AppError.notFoundError("Logbook not found");

    const createLogbookProps = {
      id: lightLogbook.id,
      userId: lightLogbook.userId,
      name: lightLogbook.name,
      description: lightLogbook.description,
      visibility: lightLogbook.visibility,
      updatedAt: lightLogbook.updatedAt,
      category: lightLogbook.category,
      logs,
      goals,
      year,
    };

    const logbook = Logbook.create(
      createLogbookProps,
      this.uuidService,
      this.dateService
    );

    return logbook;
  }
}
