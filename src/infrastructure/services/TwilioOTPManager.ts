import twilio from "twilio";
import { IOTPManager } from "../../interfaces/services/IOTPManager.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";
import env from "../config/environment.js";

export class TwilioOTPManager implements IOTPManager {
  private readonly twilioClient;

  constructor() {
    this.twilioClient = twilio(env.TWILIO_SID, env.TWILIO_TOKEN);
  }

  async generate(length: number): Promise<string> {
    return "<twilio generates its own>";
  }

  async send(phone: string, otp: string): Promise<StatusCode> {
    try {
      await this.twilioClient.verify.v2
        .services(env.TWILIO_VERIFY_SERVICE_ID)
        .verifications.create({ to: "+" + phone, channel: "sms" });
      return StatusCode.ACCEPTED;
    } catch (error) {
      console.error(error);
      return StatusCode.INTERNAL_ERROR;
    }
  }

  async verify(phone: string, otp: string): Promise<StatusCode> {
    try {
      const value = await this.twilioClient.verify.v2
        .services(env.TWILIO_VERIFY_SERVICE_ID)
        .verificationChecks.create({ to: "+" + phone, code: otp });
      if (value.status === "approved") {
        return StatusCode.OK;
      } else if (value.status === "pending") {
        return StatusCode.BAD_REQUEST;
      } else {
        return StatusCode.GONE;
      }
    } catch (error) {
      console.log(error);
      return StatusCode.INTERNAL_ERROR;
    }
  }
}
