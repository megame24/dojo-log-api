import PersistentCode from "../../../../users/entities/persistentCode";
import PersistentToken from "../../../../users/entities/persistentToken";
import emailTemplates from "./emailTemplates";

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

  async sendVerificationCodeMail(
    recipientEmail: string,
    code: PersistentCode,
    name: string
  ) {
    const emailText =
      "Thank you for registering with Dojologs. To complete your registration, please use the following verification code:";
    const sendEmailCommand = new this.SendEmailCommand({
      Source: process.env.AWS_SES_SENDER,
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: codeMailTemplate(
              <string>code.rawCode,
              name,
              emailText,
              "Email Verification"
            ),
          },
          Text: {
            Charset: "UTF-8",
            Data: `${emailText} ${code.rawCode}`,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Verify your Dojologs account",
        },
      },
    });

    try {
      return await this.emailClient.send(sendEmailCommand);
    } catch (err) {
      console.log(err);
    }
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
    const sendEmailCommand = new this.SendEmailCommand({
      Source: process.env.AWS_SES_SENDER,
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: codeMailTemplate(
              <string>code.rawCode,
              name,
              emailText,
              "Reset Password"
            ),
          },
          Text: {
            Charset: "UTF-8",
            Data: `${emailText} ${code.rawCode}`,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset your Dojologs account password",
        },
      },
    });

    try {
      return await this.emailClient.send(sendEmailCommand);
    } catch (err) {
      console.log(err);
    }
  }

  async sendPasswordResetTokenMail(
    recipientEmail: string,
    token: PersistentToken,
    name: string
  ) {
    // send <url>/token.userId/token.token
    console.log(recipientEmail, token, name);
  }
}
