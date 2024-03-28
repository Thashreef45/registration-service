import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { UserRepositoryMongoDB } from "../../infrastructure/repositories/UserRepositoryMongoDB.js";
import OTPVerificarionService from "../../use-cases/interactors/Otp.js";
import { BasicOTPGenerator } from "../../infrastructure/services/BasicOTPGenerator.js";
import { TwilioSMSSender } from "../../infrastructure/services/TwilioSMSSender.js";
import { TwilioOTPVerificationService } from "../../infrastructure/services/TwilioOTPVerificationService.js";

const userRepository = new UserRepositoryMongoDB();
const otpGenerator = new BasicOTPGenerator();
const smsSender = new TwilioSMSSender();
const twilioVerificationService = new TwilioOTPVerificationService();

const OtpGenerator = asyncHandler(_OtpGenerator);
async function _OtpGenerator(req: Request, res: Response): Promise<void> {
  const interactor = new OTPVerificarionService({
    userRepository,
    twilioVerificationService,
  });

  const data = {
    name: req.body.name,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth,
  };

  const status = await interactor.execute(data);

  const response = { status, message: "OTP has been send" };
  res.json(response);
}

export { OtpGenerator };
