import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { UserRepositoryMongoDB } from "../../infrastructure/repositories/UserRepositoryMongoDB.js";

import OTPGenerator from "../../use-cases/interactors/Otp.js";
import { BasicOTPGenerator } from "../../infrastructure/services/BasicOTPGenerator.js";

const userRepository = new UserRepositoryMongoDB();
const otpGenerator = new BasicOTPGenerator();

const OtpGenerator = asyncHandler(_OtpGenerator);
async function _OtpGenerator(req: Request, res: Response): Promise<void> {
  const interactor = new OTPGenerator({ userRepository, otpGenerator });

  const data = {
    name: req.body.name,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth,
  };

  const output = await interactor.execute(data);
  res.json(output);
}

export { OtpGenerator };
