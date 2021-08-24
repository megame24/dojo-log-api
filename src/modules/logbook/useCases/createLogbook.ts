import AppError from "../../shared/AppError";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Logbook, { LogbookVisibility } from "../entities/logbook";
import { CategoryRepo } from "../infrastructure/repositories/categoryRepo";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";
import { DateService } from "../infrastructure/services/dateService";

interface CreateLogbookDTO {
  userId: string;
  name: string;
  description?: string;
  visibility: LogbookVisibility;
  categoryId: string;
}

export interface CreateLogbook extends UseCase<CreateLogbookDTO, void> {
  execute: (createLogbookDTO: CreateLogbookDTO) => void;
}

export class CreateLogbookImpl implements CreateLogbook {
  constructor(
    private logbookRepo: LogbookRepo,
    private categoryRepo: CategoryRepo,
    private uuidService: UUIDService,
    private dateService: DateService
  ) {}

  async execute(createLogbookDTO: CreateLogbookDTO) {
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
  }
}

// Consider the following
// - Give everything that requires visibility their own visibility property
// - Plug a middleware at the end of the endpoint to check for visibility permissions (since we now have guest users)
// Alt - Find a way to plug at the beginning
