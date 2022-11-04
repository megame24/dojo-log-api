import UseCase from "../../shared/useCases/useCase";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";

export interface GetEarliestLogbookYear extends UseCase<void, Promise<number>> {
  execute: () => Promise<number>;
}

export class GetEarliestLogbookYearImpl implements GetEarliestLogbookYear {
  constructor(private logbookRepo: LogbookRepo) {}

  async execute(): Promise<number> {
    const earliestLogbookCreatedAt =
      await this.logbookRepo.getEarliestLogbookCreatedAt();

    if (!earliestLogbookCreatedAt) return new Date().getFullYear();
    return new Date(earliestLogbookCreatedAt).getFullYear();
  }
}
