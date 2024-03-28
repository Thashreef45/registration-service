import StatusCode from "../../use-cases/shared/StatusCodes.js";

export interface ISMSService {
  sendSMS(to: string, message: string): Promise<StatusCode>;
}
