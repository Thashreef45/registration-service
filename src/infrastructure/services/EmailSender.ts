import { IEmailService } from "../../interfaces/services/IEmailService.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";
import nodemailer from "nodemailer";
import environment from "../config/environment.js";

export class EmailSender implements IEmailService {
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
