import twilio from "twilio";
import { IOTPVerificationService } from "../../interfaces/services/IOTPVerificationService.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";
import env from "../config/environment.js";
import { AppError } from "../../use-cases/shared/AppError.js";

const client = twilio(env.TWILIO_SID, env.TWILIO_TOKEN);

export class TwilioOTPVerificationService implements IOTPVerificationService {
  async generateAndSend(phone: string): Promise<StatusCode> {
    try {
      await client.verify.v2
        .services(env.TWILIO_VERIFY_SERVICE_ID)
        .verifications.create({ to: "+" + phone, channel: "sms" }); ///this is slopy af..
      return StatusCode.ACCEPTED;
    } catch (error) {
      throw new AppError(
        "Error at verification service of twilio",
        StatusCode.INTERNAL_ERROR
      );
    }
  }
  async verify(phone: string, OTP: string): Promise<StatusCode> {
    return StatusCode.ACCEPTED;
  }
}
