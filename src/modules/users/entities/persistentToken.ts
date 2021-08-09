import { SecurityService } from "../infrastructure/services/securityService";

export interface PersistentTokenProps {
  userId: string;
  token?: string;
}

export default class PersistentToken {
  private constructor(private props: PersistentTokenProps) {}

  get userId(): string {
    return this.props.userId;
  }

  get token(): string | undefined {
    return this.props.token;
  }

  static create(
    props: PersistentTokenProps,
    securityService: SecurityService
  ): PersistentToken {
    if (!props.token) {
      props.token = securityService.generateToken(
        { userId: props.userId },
        "1h"
      );
    }

    return new PersistentToken({
      userId: props.userId,
      token: props.token,
    });
  }
}
