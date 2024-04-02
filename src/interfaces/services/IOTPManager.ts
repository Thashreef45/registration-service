import StatusCode from "../../use-cases/shared/StatusCodes.js";

export interface IOTPManager {
  generate(length: number): Promise<string>;
  send(phone: string, otp: string): Promise<StatusCode>;
  verify(phone: string, otp: string): Promise<StatusCode>;
}
