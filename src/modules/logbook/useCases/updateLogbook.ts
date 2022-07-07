import { DateService } from "../../shared/infrastructure/services/dateService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import { User } from "../../users/api";
import { Visibility } from "../api";
import Logbook from "../entities/logbook";
import { CategoryRepo } from "../infrastructure/repositories/categoryRepo";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";

interface UpdateLogbookDTO {
  logbook: Logbook;
  name?: string;
  description?: string;
  visibility?: Visibility;
  categoryId?: string;
  user: User;
}

export interface UpdateLogbook extends UseCase<UpdateLogbookDTO, void> {
  execute: (updateLogbookDTO: UpdateLogbookDTO) => void;
}

export class UpdateLogbookImpl implements UpdateLogbook {
  constructor(
    private logbookRepo: LogbookRepo,
    private uuidService: UUIDService,
    private categoryRepo: CategoryRepo,
    private dateService: DateService
  ) {}

  async execute(updateLogbookDTO: UpdateLogbookDTO) {
    const {
      logbook: outdatedLogbook,
      name,
      description,
      visibility,
      user,
      categoryId,
    } = updateLogbookDTO;

    let category;
    if (categoryId) {
      category = await this.categoryRepo.getCategoryById(categoryId);
    }

    const updateLogbookProps = {
      id: outdatedLogbook.id,
      userId: outdatedLogbook.userId,
      name: outdatedLogbook.name,
      description: outdatedLogbook.description,
      visibility: outdatedLogbook.visibility,
      category: outdatedLogbook.category,
      ...(name && { name }),
      ...(description && { description }),
      ...(visibility && { visibility }),
      ...(category && { category }),
    };

    const logbook = Logbook.create(
      updateLogbookProps,
      this.uuidService,
      this.dateService
    );

    await this.logbookRepo.update(logbook, user);
  }
}
