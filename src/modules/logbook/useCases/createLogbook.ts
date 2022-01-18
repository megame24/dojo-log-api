import AppError from "../../shared/AppError";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Logbook, { Visibility } from "../entities/logbook";
import { CategoryRepo } from "../infrastructure/repositories/categoryRepo";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";
import { DateService } from "../infrastructure/services/dateService";

interface CreateLogbookDTO {
  userId: string;
  name: string;
  description?: string;
  visibility: Visibility;
  categoryId: string;
}

export interface CreateLogbook
  extends UseCase<CreateLogbookDTO, Promise<Logbook>> {
  execute: (createLogbookDTO: CreateLogbookDTO) => Promise<Logbook>;
}

export class CreateLogbookImpl implements CreateLogbook {
  constructor(
    private logbookRepo: LogbookRepo,
    private categoryRepo: CategoryRepo,
    private uuidService: UUIDService,
    private dateService: DateService
  ) {}

  async execute(createLogbookDTO: CreateLogbookDTO): Promise<Logbook> {
    const { userId, name, description, visibility, categoryId } =
      createLogbookDTO;

    const category = await this.categoryRepo.getCategoryById(categoryId);
    if (!category) throw AppError.notFoundError("Category not found");

    const createLogbookProps = {
      userId,
      name,
      description,
      visibility,
      category,
    };
    const logbook = Logbook.create(
      createLogbookProps,
      this.uuidService,
      this.dateService
    );

    await this.logbookRepo.create(logbook);
    return logbook;
  }
}
