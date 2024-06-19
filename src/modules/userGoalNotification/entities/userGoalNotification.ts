import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

export interface UserGoalNotificationProps {
  id?: string;
  email: string;
  name: string;
  goalName: string;
  dueDate: Date;
  userId: string;
  logbookId: string;
  notificationId: string;
  goalId: string;
  notificationDate: Date;
  finalNotificationDate: Date;
  expoNotificationTokens?: string[];
}

export default class UserGoalNotification extends Entity {
  private constructor(
    private props: UserGoalNotificationProps,
    uuidService: UUIDService
  ) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get goalName(): string {
    return this.props.goalName;
  }

  get dueDate(): Date {
    return this.props.dueDate;
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

  get goalId(): string {
    return this.props.goalId;
  }

  get notificationDate(): Date {
    return this.props.notificationDate;
  }

  get finalNotificationDate(): Date {
    return this.props.notificationDate;
  }

  get expoNotificationTokens(): string[] | undefined {
    return this.props.expoNotificationTokens;
  }

  static create(
    props: UserGoalNotificationProps,
    uuidService: UUIDService
  ): UserGoalNotification {
    this.validateProp(
      { key: "email", value: props.email },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "name", value: props.name },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "goalName", value: props.goalName },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "dueDate", value: props.dueDate },
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
      { key: "goalId", value: props.goalId },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "notificationDate", value: props.notificationDate },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "finalNotificationDate", value: props.finalNotificationDate },
      this.isRequiredValidation
    );

    return new UserGoalNotification(props, uuidService);
  }
}
