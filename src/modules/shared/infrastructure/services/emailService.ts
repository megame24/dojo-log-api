import { PersistentToken } from "../../../users/api";

export interface EmailService {
  sendVerificationMail: (email: string, token: PersistentToken) => void;
  sendPasswordResetMail: (email: string, token: PersistentToken) => void;
}

export class EmailServiceImpl implements EmailService {
  async sendVerificationMail(email: string, token: PersistentToken) {
    // send <url>/token.userId/token.token
    console.log(email, token);
  }

  async sendPasswordResetMail(email: string, token: PersistentToken) {
    // send <url>/token.userId/token.token
    console.log(email, token);
  }
}
