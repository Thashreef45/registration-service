import StatusCode from "../../use-cases/shared/StatusCodes.js";

export interface IEmailService {
  sendEmail(to: string, subject: string, body: string): Promise<StatusCode>;
}
