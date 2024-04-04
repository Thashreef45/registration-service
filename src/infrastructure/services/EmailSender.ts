import { EmailData, IEmailService } from "../../interfaces/services/IEmailService.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";
import nodemailer from "nodemailer";
import environment from "../config/environment.js";

const personalEmailDomains = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'zoho.com',
  'protonmail.com',
  'yandex.com',
  'gmx.com',
  'live.com',
  'me.com',
  'inbox.com',
  'rocketmail.com',
  'fastmail.com',
  'tutanota.com',
  'mailinator.com',
  'hushmail.com',
  'runbox.com'
];

const institutionalEmailDomains = [
  'edu',
  'ac',
  'gov',
  'mil',
  'org'
];

function identifyEmail(email: string): undefined | "industry" | "institute" | "individual" {
  const extension = email.split('@').at(-1);
  if (!extension) {
    return;
  }

  if (personalEmailDomains.some(e => e.endsWith(extension))) {
    return "individual";
  }

  if (institutionalEmailDomains.some(e => e.endsWith(extension))) {
    return "institute";
  }

  return "industry";
}


export class EmailSender implements IEmailService {
  async identify(email: string): Promise<EmailData> {
    let valid = true;
    let entity = identifyEmail(email);

    const extension = email.split('@').at(-1);
    if (!extension) {
      valid = false;
    }

    return {
      valid: true,
      extension,
      entity
    }  
  }
  
  async sendEmail(
    to: string,
    subject: string,
    body: string
  ): Promise<StatusCode> {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: environment.MAIL_USERNAME,
          pass: environment.MAIL_PASS,
        },
      });
      const info = await transporter.sendMail({
        from: environment.MAIL_USERNAME, // sender address
        to: to,
        subject: subject, // Subject line
        // text: "Hello world?", // plain text body
        html: body, // html body
      });
      console.log("mail has been send ", info.messageId);
      return StatusCode.OK;
    } catch (error) {
      console.log(error);
      return StatusCode.INTERNAL_ERROR;
    }
  }
}
