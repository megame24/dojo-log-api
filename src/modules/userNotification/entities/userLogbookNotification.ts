import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

export interface UserLogbookNotificationProps {
  id?: string;
  name: string;
  userId: string;
  logbookId: string;
  notificationId: string;
  title: string;
  body: string;
  days: any;
  hour: number;
  expoNotificationTokens?: string[];
}

export default class UserLogbookNotification extends Entity {
  private constructor(
    private props: UserLogbookNotificationProps,
    uuidService: UUIDService
  ) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get userId(): string {
    return this.props.userId;
  }

  get logbookId(): string {
    return this.props.logbookId;
  }

  get notificationId(): string {
    return this.props.notificationId;
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

  get expoNotificationTokens(): string[] | undefined {
    return this.props.expoNotificationTokens;
  }

  static create(
    props: UserLogbookNotificationProps,
    uuidService: UUIDService
  ): UserLogbookNotification {
    this.validateProp(
      { key: "name", value: props.name },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "userId", value: props.userId },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "logbookId", value: props.logbookId },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "notificationId", value: props.notificationId },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "title", value: props.title },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "body", value: props.body },
      this.isRequiredValidation
    );
    this.validateProp({ key: "hour", value: props.hour }, this.validateNumber);

    return new UserLogbookNotification(props, uuidService);
  }
}
