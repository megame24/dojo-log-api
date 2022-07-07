import { PersistentToken } from "../../../users/api";
import PersistentCode from "../../../users/entities/persistentCode";

export interface EmailService {
  sendVerificationMail: (
    email: string,
    token: PersistentToken | PersistentCode
  ) => void;
  sendPasswordResetMail: (
    email: string,
    token: PersistentToken | PersistentCode
  ) => void;
}

export class EmailServiceImpl implements EmailService {
  async sendVerificationMail(
    email: string,
    token: PersistentToken | PersistentCode
  ) {
    // send <url>/token.userId/token.token
    console.log(email, token);
  }

  async sendPasswordResetMail(
    email: string,
    token: PersistentToken | PersistentCode
  ) {
    // send <url>/token.userId/token.token
    console.log(email, token);
  }
}
