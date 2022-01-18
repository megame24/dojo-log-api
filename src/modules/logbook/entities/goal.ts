import Entity, { ValidationResult } from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import { DateService } from "../infrastructure/services/dateService";
import { Visibility } from "./logbook";
import Reward from "./reward";

export interface GoalProps {
  id?: string;
  logbookId: string;
  userId: string;
  visibility: Visibility;
  name: string;
  description?: string;
  achieved: boolean;
  achievementCriteria: string;
  date: Date;
  rewards?: Reward[];
}

export default class Goal extends Entity {
  private constructor(private props: GoalProps, uuidService: UUIDService) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get visibility(): Visibility {
    return this.props.visibility;
  }

  get name(): string {
    return this.props.name;
  }

  get logbookId(): string {
    return this.props.logbookId;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get achieved(): boolean {
    return this.props.achieved;
  }

  get achievementCriteria(): string {
    return this.props.achievementCriteria;
  }

  get date(): Date {
    return this.props.date;
  }

  get rewards(): Reward[] | undefined {
    return this.props.rewards;
  }

  private static formatDate(date: Date, dateService: DateService): Date {
    return dateService.getTimelessDate(date);
  }

  private static validateDate(prop: {
    date: Date;
    id: string | undefined;
    dateService: DateService;
  }): ValidationResult {
    const { date, id, dateService } = prop;
    // only check for backdating on create
    if (id) return Goal.validValidationResult;

    const now = new Date();
    const beginningOfToday = Goal.formatDate(now, dateService);
    if (date < beginningOfToday) {
      return { isValid: false, message: "Can't set Goal date in the past" };
    }
    return Goal.validValidationResult;
  }

  static create(
    props: GoalProps,
    uuidService: UUIDService,
    dateService: DateService
  ): Goal {
    this.validateProp(
      { key: "logbookId", value: props.logbookId },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "userId", value: props.userId },
      this.isRequiredValidation
    );
    this.validateProp(
      {
        key: "logbook visibility",
        value: props.visibility,
        Enum: Visibility,
      },
      this.validateEnum
    );
    this.validateProp({ key: "Name", value: props.name }, this.validateString);

    this.validateProp(
      { key: "date", value: props.date },
      this.isRequiredValidation
    );
    props.date = this.formatDate(props.date, dateService);
    this.validateProp(
      { date: props.date, id: props.id, dateService },
      this.validateDate
    );

    this.validateProp(
      { key: "achievementCriteria", value: props.achievementCriteria },
      this.isRequiredValidation
    );

    if (!props.achieved) props.achieved = false;

    return new Goal(props, uuidService);
  }
}
