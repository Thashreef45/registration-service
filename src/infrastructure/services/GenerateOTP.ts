import { IOtpGenerator } from "../../interfaces/services/IOtpGenerator.js";

export class GenerateOTP implements IOtpGenerator {
  generate(length: number): string {
    let OTP = "";
    for (let i = 1; i <= length; i++)
      OTP += Math.floor(Math.random() * 10).toString();
    return OTP;
  }
}
