import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

interface ExpoNotificationTokenProps {
  id?: string;
  token: string;
  userId: string;
}

export default class ExpoNotificationToken extends Entity {
  private constructor(
    private props: ExpoNotificationTokenProps,
    uuidService: UUIDService
  ) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }

  static create(
    props: ExpoNotificationTokenProps,
    uuidService: UUIDService
  ): ExpoNotificationToken {
    this.validateProp(
      { key: "userId", value: props.userId },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "token", value: props.token },
      this.isRequiredValidation
    );

    return new ExpoNotificationToken(props, uuidService);
  }
}
