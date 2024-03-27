import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { UserRepositoryMongoDB } from "../../infrastructure/repositories/UserRepositoryMongoDB.js";

import OTP_Generator from "../../use-cases/interactors/Otp.js";
import { GenerateOTP } from "../../infrastructure/services/GenerateOTP.js";

const UserRepository = new UserRepositoryMongoDB();
const Otp_Generator = new GenerateOTP();

const OtpGenerator = asyncHandler(_OtpGenerator);

async function _OtpGenerator(req: Request, res: Response): Promise<void> {
  const interactor = new OTP_Generator(UserRepository, Otp_Generator);

  const data = {
    name: req.body.name,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth,
  };

  const output = await interactor.execute(data);
  res.json(output);
}

export { OtpGenerator };
