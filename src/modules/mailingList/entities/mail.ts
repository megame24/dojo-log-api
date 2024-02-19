import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

export interface MailProps {
  id?: string;
  email: string;
  subscribed: boolean;
}

export default class Mail extends Entity {
  private constructor(private props: MailProps, uuidService: UUIDService) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get subscribed(): boolean {
    return this.props.subscribed;
  }

  static create(props: MailProps, uuidService: UUIDService): Mail {
    this.validateProp(props.email, this.validateEmail);
    props.email = this.formatEmail(props.email);

    return new Mail(props, uuidService);
  }
}
