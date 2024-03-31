import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

//* Interactors
import CreateAccount from "../../use-cases/interactors/CreateAccount.js";

//* Dependencies
import { UserRepositoryMongoDB } from "../../infrastructure/repositories/UserRepositoryMongoDB.js";
import { GiggrSnowflake } from "../../infrastructure/services/GiggrSnowflakeAccountIdGenerator.js";
import StartSignupProcess from "../../use-cases/interactors/StartSignupProcess.js";
import RegistrationRepositoryMongoDB from "../../infrastructure/repositories/RegistrationRepositoryMongoDB.js";
import { CryptoUUIDGenerator } from "../../infrastructure/services/CryptoUUIDGenerator.js";
import ConfirmPhoneForOTP from "../../use-cases/interactors/ConfirmPhoneForOTP.js";
import { TwilioOTPManager } from "../../infrastructure/services/TwilioOTPManager.js";
import VerifyPhoneWithOTP from "../../use-cases/interactors/VerifyPhoneWithOTP.js";
import Converse from "../../use-cases/interactors/Converse.js";
import ChatRepositoryMongoDB from "../../infrastructure/repositories/ChatRepositoryMongoDB.js";
import { ChatGPTSignupAssistant } from "../../infrastructure/services/ChatGPTSignupAssistant.js";
import ConfirmEmailForLink from "../../use-cases/interactors/ConfirmEmailForLink.js";
import { EmailSender } from "../../infrastructure/services/EmailSender.js";

const userRepository = new UserRepositoryMongoDB();
const accountIdGenerator = new GiggrSnowflake();
const registrationRepository = new RegistrationRepositoryMongoDB();
const uuidGenerator = new CryptoUUIDGenerator();
const otpManager = new TwilioOTPManager();
const chatRepository = new ChatRepositoryMongoDB();
const emailService = new EmailSender();

export const RegisterUser = asyncHandler(_RegisterUser);
async function _RegisterUser(req: Request, res: Response): Promise<void> {
  const interactor = new CreateAccount({ userRepository, accountIdGenerator });

  const data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth,
  };

  const output = await interactor.execute(data);
  res.json(output);
}


// POST /signup (DOB)
export const StartSignup = asyncHandler(_StartSignup);
async function _StartSignup(req: Request, res: Response): Promise<void> {
  const interactor = new StartSignupProcess({ registrationRepository, uuidGenerator });

  const data = {
    dateOfBirth: req.body.dateOfBirth
  };

  const output = await interactor.execute(data);
  res.json(output);
}

// POST /signup/phone (OTP Request)
export const ConfirmPhone = asyncHandler(_ConfirmPhone);
async function _ConfirmPhone(req: Request, res: Response): Promise<void> {
  const interactor = new ConfirmPhoneForOTP({ registrationRepository, otpManager });

  const signupId = req.headers["authorization"]?.slice(7) || "";
  const data = {
    signupId,
    phone: req.body.phone
  }

  const output = await interactor.execute(data);
  res.json(output);
}

// POST /signup/phone/verify (OTP Verify)
export const VerifyPhone = asyncHandler(_VerifyPhone);
async function _VerifyPhone(req: Request, res: Response): Promise<void> {
  const interactor = new VerifyPhoneWithOTP({ registrationRepository, otpManager });

  const signupId = req.headers["authorization"]?.slice(7) || "";
  const data = {
    signupId,
    phone: req.body.phone,
    otp: req.body.otp
  } 

  const output = await interactor.execute(data);
  res.json(output);
}


// POST /signup/email (Email Request)
export const ConfirmEmail = asyncHandler(_ConfirmEmail);
async function _ConfirmEmail(req: Request, res: Response): Promise<void> {
  const interactor = new ConfirmEmailForLink({ registrationRepository, emailService });

  const signupId = req.headers["authorization"]?.slice(7) || "";
  const data = {
    signupId,
    email: req.body.email
  }

  const output = await interactor.execute(data);
  res.json(output);
}

// POST /signup/email/verify (Magic Link)
// POST /signup/email/google

// POST /signup/phone/verify (OTP Verify)
export const ChatAssistant = asyncHandler(_ChatAssistant);
async function _ChatAssistant(req: Request, res: Response): Promise<void> {
  const signupId = req.headers["authorization"]?.slice(7) || "";
  const signupAssistant = new ChatGPTSignupAssistant(signupId);

  const interactor = new Converse({ registrationRepository, chatRepository, signupAssistant });

  const data = {
    signupId,
    message: req.body.message
  } 

  const output = await interactor.execute(data);
  res.json(output);
}


