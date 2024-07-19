import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

export interface GoalNotificationProps {
  id?: string;
  goalId: string;
  notificationDate: Date;
  finalNotificationDate: Date;
}

export default class GoalNotification extends Entity {
  private constructor(
    private props: GoalNotificationProps,
    uuidService: UUIDService
  ) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get goalId(): string {
    return this.props.goalId;
  }

  get notificationDate(): Date {
    return this.props.notificationDate;
  }

  get finalNotificationDate(): Date {
    return this.props.finalNotificationDate;
  }

  static create(
    props: GoalNotificationProps,
    uuidService: UUIDService
  ): GoalNotification {
    this.validateProp(
      { key: "goalId", value: props.goalId },
      this.isRequiredValidation
    );

    this.validateProp(
      { key: "notification date", value: props.notificationDate },
      this.isRequiredValidation
    );

    this.validateProp(
      { key: "finalNotificationDate", value: props.finalNotificationDate },
      this.isRequiredValidation
    );

    return new GoalNotification(props, uuidService);
  }
}
