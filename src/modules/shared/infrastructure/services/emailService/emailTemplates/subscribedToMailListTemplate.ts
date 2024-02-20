import footerTemplate from "./footerTemplate";
import headerTemplate from "./headerTemplate";

interface SubscribedToMailListTemplateReturnType {
  text: string;
  html: string;
  subject: string;
}

const subscribedToMailListTemplate =
  (): SubscribedToMailListTemplateReturnType => {
    const title = "Thank you";
    const subject = "Get notified about Dojologs release";
    const content =
      "Thank you for subscribing to get notified when Dojologs goes live.";
    const html = `
    ${headerTemplate(title)}
      <p>${content}</p>
      <div class="farewell zero-margin-bottom">
        <p>Best regards,<br />Dojologs team</p>
      </div>
    ${footerTemplate(true)}
  `;
    return {
      text: content,
      html,
      subject,
    };
  };

export default subscribedToMailListTemplate;
