import Entity, { ValidationResult } from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import { SecurityService } from "../infrastructure/services/securityService";

// USER WILL HAVE AN ARRAY OF EXPO PUSH NOTIFICATION TOKENS

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
  BOT = "BOT",
}

interface UserProps {
  id?: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  role?: Role;
  verified?: boolean;
  expoNotificationTokens?: string[];
}

export interface CreateUserProps extends UserProps {
  isPasswordHashed: boolean;
  isPasswordRequired: boolean;
}

export default class User extends Entity {
  private constructor(private props: UserProps, uuidService: UUIDService) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get username(): string {
    return this.props.username;
  }

  get password(): string | undefined {
    return this.props.password;
  }

  get role(): Role | undefined {
    return this.props.role;
  }

  get verified(): boolean | undefined {
    return this.props.verified;
  }

  get expoNotificationTokens(): string[] | undefined {
    return this.props.expoNotificationTokens;
  }

  private static validatePassword(
    password: string | undefined
  ): ValidationResult {
    if (!password) {
      return { isValid: false, message: "Password is required" };
    }
    if (!User.passwordRegEx.test(password)) {
      return {
        isValid: false,
        message:
          "Your password must be greater than 8 characters and must contain at least one " +
          "uppercase letter, one lowercase letter, one number, and a special character",
      };
    }
    return User.validValidationResult;
  }

  static async create(
    createUserProps: CreateUserProps,
    securityService: SecurityService,
    uuidService: UUIDService
  ): Promise<User> {
    const props = { ...createUserProps };

    this.validateProp({ key: "Name", value: props.name }, this.validateString);
    this.validateProp(
      { key: "Username", value: props.username },
      this.validateString
    );

    this.validateProp(props.email, this.validateEmail);
    props.email = this.formatEmail(props.email);

    if (props.isPasswordRequired) {
      this.validateProp(props.password, this.validatePassword);
    } else {
      props.password = undefined;
    }

    if (props.role) {
      this.validateProp(
        { key: "role", value: props.role, Enum: Role },
        this.validateEnum
      );
    } else {
      props.role = Role.USER;
    }

    if (!props.isPasswordHashed && props.password) {
      props.password = await securityService.hash(props.password);
    }

    if (!props.verified) {
      props.verified = false;
    }

    if (!props.expoNotificationTokens) {
      props.expoNotificationTokens = [];
    }

    return new User(props, uuidService);
  }
}
