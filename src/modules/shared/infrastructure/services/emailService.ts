import { PersistentToken } from "../../../users/api";
import PersistentCode from "../../../users/entities/persistentCode";

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

  codeMailTemplate(code: string, name: string, content: string) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                font-size: 18px;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
              }
              .company-name {
                margin-bottom: 20px;
                color: #2980B9;
              }
              .verification-code {
                text-align: center;
                padding: 10px 15px;
                border-radius: 5px;
                letter-spacing: 5px;
              }
              .instructions {
                margin-top: 30px;
              }
              .farewell {
                margin-top: 30px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="company-name">
                  <h2>Dojologs</h2>
              </div>
              <p>Hello ${name},</p>
              <p>${content}</p>
              <h1 class="verification-code">${code}</h1>
              <div class="instructions">
                  <p>If you didn't request this email, you can safely ignore it.</p>
                  <p>This code is valid for ${
                    process.env.VERIFICATION_CODE_EXPIRES_IN
                      ? process.env.VERIFICATION_CODE_EXPIRES_IN[0]
                      : 0
                  } hour(s) from the time of this email.</p>
              </div>
              <div class="farewell">
                <p>Best regards,<br />Dojologs team</p>
              </div>
          </div>
      </body>
      </html>
    `;
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
            Data: this.codeMailTemplate(<string>code.rawCode, name, emailText),
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
            Data: this.codeMailTemplate(<string>code.rawCode, name, emailText),
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
