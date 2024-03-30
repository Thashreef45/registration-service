import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { UserRepositoryMongoDB } from "../../infrastructure/repositories/UserRepositoryMongoDB.js";
import { TwilioOTPManager } from "../../infrastructure/services/TwilioOTPManager.js";
import OTPVerificationInteractor from "../../use-cases/interactors/PhoneOTPVerify.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";

const userRepository = new UserRepositoryMongoDB();
const twilioVerificationService = new TwilioOTPManager();

export const ConfirmOTP = asyncHandler(_ConfirmOTP);
async function _ConfirmOTP(req: Request, res: Response): Promise<void> {
  const interactor = new OTPVerificationInteractor({
    userRepository,
    twilioVerificationService,
  });
  
  const { phone, OTP } = req.body;

  const status = await interactor.execute({ phone, OTP });
  const response = { status, message: "OTP has been confirmed" };
  res.json(response);
}
