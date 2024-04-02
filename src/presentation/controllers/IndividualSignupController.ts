import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { GiggrSnowflake } from "../../infrastructure/services/GiggrSnowflakeAccountIdGenerator.js";
import InitiateRegistration from "../../use-cases/interactors/InitiateRegistration.js";
import RegistrationRepositoryMongoDB from "../../infrastructure/repositories/RegistrationRepositoryMongoDB.js";
import { CryptoUUIDGenerator } from "../../infrastructure/services/CryptoUUIDGenerator.js";
import RequestPhoneOTP from "../../use-cases/interactors/RequestPhoneOTP.js";
import { TwilioOTPManager } from "../../infrastructure/services/TwilioOTPManager.js";
import VerifyPhoneOTP from "../../use-cases/interactors/VerifyPhoneOTP.js";
import Converse from "../../use-cases/interactors/Converse.js";
import ChatRepositoryMongoDB from "../../infrastructure/repositories/ChatRepositoryMongoDB.js";
import { ChatGPTSignupAssistant } from "../../infrastructure/services/ChatGPTSignupAssistant.js";
import RequestEmailOTP from "../../use-cases/interactors/RequestEmailOTP.js";
import { EmailSender } from "../../infrastructure/services/EmailSender.js";
import GetConversation from "../../use-cases/interactors/GetConversation.js";
import UpdateRegistration from "../../use-cases/interactors/UpdateRegistration.js";
import RetrieveRegistration from "../../use-cases/interactors/RetrieveRegistration.js";
import VerifyEmailOTP from "../../use-cases/interactors/VerifyEmailOTP.js";
import FinishRegistration from "../../use-cases/interactors/FinishRegistration.js";

const accountIdGenerator = new GiggrSnowflake();
const registrationRepository = new RegistrationRepositoryMongoDB();
const uuidGenerator = new CryptoUUIDGenerator();
const otpManager = new TwilioOTPManager();
const chatRepository = new ChatRepositoryMongoDB();
const emailService = new EmailSender();


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

export const ChatAssistantGet = asyncHandler(_ChatAssistantGet);
async function _ChatAssistantGet(req: Request, res: Response): Promise<void> {
  const signupId = req.headers["authorization"]?.slice(7) || "";
  const signupAssistant = new ChatGPTSignupAssistant(signupId);

  const interactor = new GetConversation({ registrationRepository, chatRepository, signupAssistant });

  const data = {
    signupId
  }

  const output = await interactor.execute(data);
  res.json(output);
}

export const InitiateRegistrationPost = asyncHandler(_InitiateRegistrationPost);
async function _InitiateRegistrationPost(req: Request, res: Response) {
  const interactor = new InitiateRegistration({ registrationRepository, uuidGenerator });

  // todo: req.metadata
  // entity, deviceId, locationId, networkId
  const data = req.body;

  const result = await interactor.execute(data);

  res.json(result);
}

export const RetrieveRegistrationGet = asyncHandler(_RetrieveRegistrationGet);
async function _RetrieveRegistrationGet(req: Request, res: Response) {
  const interactor = new RetrieveRegistration({ registrationRepository });

  const result = await interactor.execute({ signupId: req.signupId });

  res.json(result);
}


export const UpdateRegistrationPatch = asyncHandler(_UpdateRegistrationPatch)
async function _UpdateRegistrationPatch(req: Request, res: Response) {
  const interactor = new UpdateRegistration({ registrationRepository });

  const output = await interactor.execute({
    signupId: req.signupId,

    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth
  });

  res.json(output)
}

export const RequestOTPGet = asyncHandler(_ReqOTPGet)
async function _ReqOTPGet(req: Request, res: Response) {
  const field = req.params.field as "phone" | "email";

  if (field === "email") {
    const interactor = new RequestEmailOTP({ registrationRepository, emailService });
    const output = interactor.execute({ signupId: req.signupId });
    res.json(output);
  } else if (field === "phone") {
    const interactor = new RequestPhoneOTP({ registrationRepository, otpManager });
    const output = interactor.execute({ signupId: req.signupId });
    res.json(output);
  } else {
    res.status(400).json({ message: ":field must be phone/email" })
  }
}

export const VerifyOTPPost = asyncHandler(_VerifyOTPPost)
async function _VerifyOTPPost(req: Request, res: Response) {
  const field = req.params.field as "phone" | "email";
  const otp = req.body.otp as string;

  if (field === "email") {
    const interactor = new VerifyEmailOTP({ registrationRepository });
    const output = interactor.execute({ signupId: req.signupId, otp });
    res.json(output);
  } else if (field === "phone") {
    const interactor = new VerifyPhoneOTP({ registrationRepository, otpManager });
    const output = interactor.execute({ signupId: req.signupId, otp });
    res.json(output);
  } else {
    res.status(400).json({ message: ":field must be phone/email" })
  }
}

export const FinishRegistrationPost = asyncHandler(_FinishRegistrationPost)
async function _FinishRegistrationPost(req: Request, res: Response) {
  const interactor = new FinishRegistration({ registrationRepository, accountIdGenerator })
  const output = interactor.execute({ signupId: req.signupId });
  res.json(output);
}