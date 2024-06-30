import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

export interface LogbookNotificationProps {
  id?: string;
  logbookId: string;
  title?: string;
  body?: string;
  days: any;
  hour: number;
}

export default class LogbookNotification extends Entity {
  private constructor(
    private props: LogbookNotificationProps,
    uuidService: UUIDService
  ) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get logbookId(): string {
    return this.props.logbookId;
  }

  get title(): string | undefined {
    return this.props.title;
  }

  get body(): string | undefined {
    return this.props.body;
  }

  get days(): number[] {
    return this.props.days;
  }

  get hour(): number {
    return this.props.hour;
  }

  static create(
    props: LogbookNotificationProps,
    uuidService: UUIDService
  ): LogbookNotification {
    this.validateProp(
      { key: "logbookId", value: props.logbookId },
      this.isRequiredValidation
    );

    this.validateProp({ key: "hour", value: props.hour }, this.validateNumber);

    return new LogbookNotification(props, uuidService);
  }
}
