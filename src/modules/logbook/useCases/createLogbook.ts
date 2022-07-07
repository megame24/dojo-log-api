import { DateService } from "../../shared/infrastructure/services/dateService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Logbook, { Visibility } from "../entities/logbook";
import { CategoryRepo } from "../infrastructure/repositories/categoryRepo";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";

interface CreateLogbookDTO {
  userId: string;
  name: string;
  description?: string;
  visibility: Visibility;
  categoryId?: string;
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

    let category;
    if (categoryId) {
      category = await this.categoryRepo.getCategoryById(categoryId);
    }

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
