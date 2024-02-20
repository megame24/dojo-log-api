import footerTemplate from "./footerTemplate";
import headerTemplate from "./headerTemplate";

const codeMailTemplate = (
  code: string,
  name: string,
  content: string,
  title: string
): string => {
  return `
    ${headerTemplate(title, name)}
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
      <div class="farewell zero-margin-bottom">
        <p>Best regards,<br />Dojologs team</p>
      </div>
    ${footerTemplate(false)}
  `;
};

export default codeMailTemplate;
