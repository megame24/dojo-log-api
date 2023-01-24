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
  durationOfWork?: string;
  // make proofOfWork it's own entity in the future !!!!!!
  proofOfWork?: File;
}

export default class Log extends Entity {
  private static durationOfWorkRegEx =
    /^(2[0-3][h]|[0-1]?[0-9][h])$|^((([0]?|[1-5]{1})[0-9])[m])$|^((2[0-3][h]|[0-1]?[0-9][h])\s((([0]?|[1-5]{1})[0-9])[m]))$/;

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

  get durationOfWork(): string | undefined {
    return this.props.durationOfWork;
  }

  get proofOfWork(): File | undefined {
    return this.props.proofOfWork;
  }

  private static validateDurationOfWork(
    durationOfWork: string
  ): ValidationResult {
    if (!Log.durationOfWorkRegEx.test(durationOfWork)) {
      return { isValid: false, message: "Invalid duration of work format" };
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

    if (props.durationOfWork) {
      this.validateProp(props.durationOfWork, this.validateDurationOfWork);
    }

    return new Log(props, uuidService);
  }
}
