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
  sendPasswordResetMail: (
    email: string,
    token: PersistentToken | PersistentCode
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

  verificationCodeMailTemplate(verificationCode: string, name: string) {
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
              <p>Dear ${name},</p>
              <p>Thank you for registering with Dojologs. To complete your registration, please use the following verification code:</p>
              <h1 class="verification-code">${verificationCode}</h1>
              <div class="instructions">
                  <p>If you didn't request this email, you can safely ignore it.</p>
                  <p>This verification code is valid for ${
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
    const sendEmailCommand = new this.SendEmailCommand({
      Source: process.env.AWS_SES_SENDER,
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: this.verificationCodeMailTemplate(<string>code.rawCode, name),
          },
          Text: {
            Charset: "UTF-8",
            Data: `Thank you for registering with Dojologs. To complete your registration, please use the following verification code: ${code.rawCode}`,
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

  async sendPasswordResetMail(
    email: string,
    tokenOrCode: PersistentToken | PersistentCode
  ) {
    // send <url>/token.userId/token.token
    console.log(email, tokenOrCode);
  }
}
