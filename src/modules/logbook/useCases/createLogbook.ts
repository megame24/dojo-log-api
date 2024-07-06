import { DateService } from "../../shared/infrastructure/services/dateService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import User from "../../users/entities/user";
import Logbook, { Visibility } from "../entities/logbook";
import { CategoryRepo } from "../infrastructure/repositories/categoryRepo";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";
import { SaveLogbookNotifications } from "./saveLogbookNotifications";

interface CreateLogbookDTO {
  userId: string;
  name: string;
  description?: string;
  visibility: Visibility;
  categoryId?: string;
  enableReminder: boolean;
  user: User;
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
    private dateService: DateService,
    private saveLogbookNotifications: SaveLogbookNotifications
  ) {}

  async execute(createLogbookDTO: CreateLogbookDTO): Promise<Logbook> {
    const {
      userId,
      name,
      description,
      visibility,
      categoryId,
      enableReminder,
      user,
    } = createLogbookDTO;

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

    await this.logbookRepo.create(logbook, user);

    if (enableReminder) await this.createLogbookNotifications(logbook);

    return logbook;
  }

  async createLogbookNotifications(logbook: Logbook) {
    const dateWithTimeSetTo4pm = this.dateService.setTimeOnDate(
      new Date(),
      16,
      0,
      0,
      true
    );
    const dateWithTimeSetTo4pmInUTC =
      this.dateService.convertDateToUTC(dateWithTimeSetTo4pm);
    const utcHours = this.dateService.getHour(dateWithTimeSetTo4pmInUTC);

    const logbookId = <string>logbook.id;

    const saveLogbookNotificationsDTO = {
      logbookId,
      notifications: [
        {
          logbookId,
          title: "Progress check-in 🔄",
          body: `Made any progress on ${logbook.name}? Tap here to log your progress!`,
          days: {
            0: { label: "Sun", id: 0 },
            1: { label: "Mon", id: 1 },
            2: { label: "Tue", id: 2 },
            3: { label: "Wed", id: 3 },
            4: { label: "Thur", id: 4 },
            5: { label: "Fri", id: 5 },
            6: { label: "Sat", id: 6 },
          },
          hour: utcHours,
        },
      ],
    };

    await this.saveLogbookNotifications.execute(saveLogbookNotificationsDTO);
  }
}
