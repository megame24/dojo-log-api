import PersistentCode from "../../../../users/entities/persistentCode";
import PersistentToken from "../../../../users/entities/persistentToken";
import { LambdaFunctionsService } from "../lambdaFunctionsService";
import emailTemplates, { ImplicitEmailTemplateIds } from "./emailTemplates";

const { codeMailTemplate } = emailTemplates;

export interface EmailService {
  sendVerificationCodeMail: (
    email: string,
    code: PersistentCode,
    name: string
  ) => void;
  sendVerificationTokenMail: (
    email: string,
    code: PersistentToken,
    name: string
  ) => void;
  sendPasswordResetTokenMail: (
    email: string,
    token: PersistentToken,
    name: string
  ) => void;
  sendPasswordResetCodeMail: (
    email: string,
    code: PersistentCode,
    name: string
  ) => void;
  sendMailToMailingList: (
    emails: string[],
    templateId: ImplicitEmailTemplateIds
  ) => void;
}

export class EmailServiceImpl implements EmailService {
  emailClient: any;

  constructor(private lambdaFunctionsService: LambdaFunctionsService) {}

  async sendEmail(
    recipientEmails: string[],
    htmlContent: string,
    rawContent: string,
    subject: string
  ) {
    const payload = [
      {
        recipientEmails,
        htmlContent,
        rawContent,
        subject,
      },
    ];

    try {
      const lambdaFunctionName = "sendEmailFunction";
      return await this.lambdaFunctionsService.invokeLambda(
        lambdaFunctionName,
        payload
      );
    } catch (err) {
      console.log(err);
    }
  }

  async sendVerificationCodeMail(
    recipientEmail: string,
    code: PersistentCode,
    name: string
  ) {
    const emailText =
      "Thank you for registering with Dojologs. To complete your registration, please use the following verification code:";
    const subject = "Verify your Dojologs account";
    const title = "Email Verification";

    await this.sendEmail(
      [recipientEmail],
      codeMailTemplate(<string>code.rawCode, name, emailText, title),
      `${emailText} ${code.rawCode}`,
      subject
    );
  }

  async sendVerificationTokenMail(
    recipientEmail: string,
    token: PersistentToken,
    name: string
  ) {
    // send <url>/token.userId/token.token
    console.log(recipientEmail, token, name);
  }

  async sendPasswordResetCodeMail(
    recipientEmail: string,
    code: PersistentCode,
    name: string
  ) {
    const emailText =
      "To reset your password, please use the following reset password code:";
    const subject = "Reset your Dojologs account password";
    const title = "Reset Password";

    await this.sendEmail(
      [recipientEmail],
      codeMailTemplate(<string>code.rawCode, name, emailText, title),
      `${emailText} ${code.rawCode}`,
      subject
    );
  }

  async sendPasswordResetTokenMail(
    recipientEmail: string,
    token: PersistentToken,
    name: string
  ) {
    // send <url>/token.userId/token.token
    console.log(recipientEmail, token, name);
  }

  async sendMailToMailingList(
    recipientEmails: string[],
    emailTemplateId: ImplicitEmailTemplateIds
  ) {
    const { html, text, subject } = emailTemplates[emailTemplateId]();

    await this.sendEmail(recipientEmails, html, text, subject);
  }
}
