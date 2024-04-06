import StatusCode from "../../use-cases/shared/StatusCodes.js";

export interface EmailData {
  /** Whether the email is valid. */
  valid: boolean;
  /** The email extension extracted. *eg:* `giggr.app` */
  extension?: string;
  /** The entity associated with the email address. */
  entity?: "individual" | "industry" | "institute";
}

export interface IEmailService {
  identify(email: string): Promise<EmailData>;
  sendEmail(to: string, subject: string, body: string): Promise<StatusCode>;
}
