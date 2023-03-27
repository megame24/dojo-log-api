import Entity, { ValidationResult } from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import File from "./file";
import { Visibility } from "./logbook";

interface LogProps {
  id?: string;
  logbookId: string;
  userId: string;
  visibility: Visibility;
  date: Date;
  message: string;
  durationOfWorkInMinutes: number;
  proofOfWork?: File;
}

export default class Log extends Entity {
  private constructor(private props: LogProps, uuidService: UUIDService) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get logbookId(): string {
    return this.props.logbookId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get visibility(): Visibility {
    return this.props.visibility;
  }

  get date(): Date {
    return this.props.date;
  }

  get message(): string {
    return this.props.message;
  }

  get durationOfWorkInMinutes(): number {
    return this.props.durationOfWorkInMinutes;
  }

  get proofOfWork(): File | undefined {
    return this.props.proofOfWork;
  }

  private static validateDurationOfWork(
    durationOfWorkInMinutes: number
  ): ValidationResult {
    if (isNaN(durationOfWorkInMinutes)) {
      return { isValid: false, message: "Duration of work must be a number" };
    }
    return Log.validValidationResult;
  }

  static create(props: LogProps, uuidService: UUIDService): Log {
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
    this.validateProp(
      { key: "message", value: props.message },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "date", value: props.date },
      this.isRequiredValidation
    );

    this.validateProp(
      props.durationOfWorkInMinutes,
      this.validateDurationOfWork
    );

    return new Log(props, uuidService);
  }
}
