import StatusCode from "../../use-cases/shared/StatusCodes.js";

export interface IOTPVerificationService {
  generateAndSend(phone: string): Promise<StatusCode>;
  verify(phone: string, OTP: string): Promise<StatusCode>;
}
