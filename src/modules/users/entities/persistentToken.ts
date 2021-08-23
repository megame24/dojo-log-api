import Entity, { ValidationResult } from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import { SecurityService } from "../infrastructure/services/securityService";

export enum TokenType {
  verification = "verification",
  resetPassword = "resetPassword",
}

interface PersistentTokenProps {
  id?: string;
  userId: string;
  type: TokenType;
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

  get type(): TokenType {
    return this.props.type;
  }
  private static validateType(type: TokenType): ValidationResult {
    if (!TokenType[type])
      return { isValid: false, message: "Invalid token type" };
    return PersistentToken.validValidationResult;
  }

  static create(
    props: PersistentTokenProps,
    securityService: SecurityService,
    uuidService: UUIDService
  ): PersistentToken {
    this.validateProp(props.type, this.validateType);
    this.validateProp(
      { key: "userId", value: props.userId },
      this.isRequiredValidation
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
