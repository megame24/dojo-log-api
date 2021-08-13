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

export default class PersistentToken {
  private constructor(private props: PersistentTokenProps) {}

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

  static create(
    props: PersistentTokenProps,
    securityService: SecurityService,
    uuidService: UUIDService
  ): PersistentToken {
    if (!props.id) {
      props.id = uuidService.generate();
    }

    if (!props.token) {
      props.token = securityService.generateToken(
        { userId: props.userId },
        process.env.VERIFICATION_TOKEN_EXPIRES_IN
      );
    }

    return new PersistentToken(props);
  }
}
