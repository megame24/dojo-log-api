import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import { SecurityService } from "../infrastructure/services/securityService";

export enum TokenOrCodeType {
  verification = "verification",
  resetPassword = "resetPassword",
}

interface PersistentTokenProps {
  id?: string;
  userId: string;
  type: TokenOrCodeType;
  token?: string;
}

export default class PersistentToken extends Entity {
  private constructor(
    private props: PersistentTokenProps,
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

  get token(): string | undefined {
    return this.props.token;
  }

  get type(): TokenOrCodeType {
    return this.props.type;
  }

  static create(
    props: PersistentTokenProps,
    securityService: SecurityService,
    uuidService: UUIDService
  ): PersistentToken {
    this.validateProp(
      { key: "userId", value: props.userId },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "token type", value: props.type, Enum: TokenOrCodeType },
      this.validateEnum
    );

    if (!props.token) {
      props.token = securityService.generateToken(
        { userId: props.userId },
        process.env.VERIFICATION_TOKEN_EXPIRES_IN
      );
    }

    return new PersistentToken(props, uuidService);
  }
}
