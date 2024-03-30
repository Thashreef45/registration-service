import { ISMSService } from "../../interfaces/services/ISMSSender.js";
import twilio from "twilio";
import env from "../config/environment.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";
import { AppError } from "../../use-cases/shared/AppError.js";

const client = twilio(env.TWILIO_SID, env.TWILIO_TOKEN);

export class TwilioSMSSender implements ISMSService {
  async sendSMS(to: string, message: string): Promise<StatusCode> {
    try {
      const option = {
        body: message,
        to: to, //this will only send otp to indian number.()
        from: "+447883303573",
      };

      await client.messages.create(option);
      return StatusCode.ACCEPTED;
    } catch (error) {
      console.log(error);
      throw new AppError("error at twilio", StatusCode.CONFLICT); //needs status code?
    }
  }
}
