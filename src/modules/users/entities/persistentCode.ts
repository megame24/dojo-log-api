import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import { SecurityService } from "../infrastructure/services/securityService";
import { TokenOrCodeType } from "./persistentToken";

interface PersistentCodeProps {
  id?: string;
  userId: string;
  type: TokenOrCodeType;
  encryptedCode?: string;
  code?: string;
  expiresIn?: Date;
}

export default class PersistentCode extends Entity {
  private constructor(
    private props: PersistentCodeProps,
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

  get code(): string | undefined {
    return this.props.code;
  }

  get encryptedCode(): string | undefined {
    return this.props.encryptedCode;
  }

  get type(): TokenOrCodeType {
    return this.props.type;
  }

  get expiresIn(): Date | undefined {
    return this.props.expiresIn;
  }

  static async create(
    props: PersistentCodeProps,
    securityService: SecurityService,
    uuidService: UUIDService
  ): Promise<PersistentCode> {
    this.validateProp(
      { key: "userId", value: props.userId },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "code type", value: props.type, Enum: TokenOrCodeType },
      this.validateEnum
    );

    if (!props.encryptedCode) {
      props.code = securityService.generateRandomDigits();
      props.encryptedCode = await securityService.hash(props.code);
    }

    if (!props.expiresIn) {
      props.expiresIn = securityService.getExpiryDate(
        process.env.VERIFICATION_CODE_EXPIRES_IN
      );
    }

    return new PersistentCode(props, uuidService);
  }
}
