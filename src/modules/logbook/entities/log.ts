import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

interface LogProps {
  id?: string;
  logbookId: string;
  date: Date;
  message: string;
  durationOfWork?: string;
  // make proofOfWork it's own entity in the future !!!!!!
  proofOfWorkImageUrl?: string;
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

  get date(): Date {
    return this.props.date;
  }

  get message(): string {
    return this.props.message;
  }

  get durationOfWork(): string | undefined {
    return this.props.durationOfWork;
  }

  get proofOfWorkImageUrl(): string | undefined {
    return this.props.proofOfWorkImageUrl;
  }

  static create(props: LogProps, uuidService: UUIDService): Log {
    this.validateProp(
      { key: "logbookId", value: props.logbookId },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "message", value: props.message },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "date", value: props.date },
      this.isRequiredValidation
    );

    return new Log(props, uuidService);
  }
}
