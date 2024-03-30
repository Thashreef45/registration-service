import { IOTPGenerator } from "../../interfaces/services/IOtpGenerator.js";

export class BasicOTPGenerator implements IOTPGenerator {
  generate(length: number = 6): string {
    let OTP = "";
    for (let i = 1; i <= length; i++)
      OTP += Math.floor(Math.random() * 10).toString();
    return OTP;
  }
}
