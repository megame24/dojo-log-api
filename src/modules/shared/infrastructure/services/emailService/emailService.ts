import PersistentCode from "../../../../users/entities/persistentCode";
import PersistentToken from "../../../../users/entities/persistentToken";
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

  constructor(private EmailClient: any, private SendEmailCommand: any) {
    this.emailClient = new this.EmailClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: <string>process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: <string>process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async sendEmail(
    recipientEmails: string[],
    htmlContent: string,
    rawContent: string,
    subject: string
  ) {
    const sendEmailCommand = new this.SendEmailCommand({
      Source: process.env.AWS_SES_SENDER,
      Destination: {
        ToAddresses: recipientEmails,
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: htmlContent,
          },
          Text: {
            Charset: "UTF-8",
            Data: rawContent,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
    });

    try {
      return await this.emailClient.send(sendEmailCommand);
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
