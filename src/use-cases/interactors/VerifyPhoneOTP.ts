import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import { IOTPManager } from "../../interfaces/services/IOTPManager.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";

export default class VerifyPhoneOTP implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly otpManager: IOTPManager;

  constructor({ registrationRepository, otpManager }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.otpManager = otpManager;
  }

  async execute({ signupId, otp }: Input): Promise<Output> {

    const registration = await this.registrationRepository.findByUUID(signupId);
    if (!registration) {
        throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }

    if (!registration.phone.number) {
      throw new AppError("No phone number found.", StatusCode.NOT_FOUND);
    }
    
    const verificationResult = await this.otpManager.verify(registration.phone.number, otp);
    if (verificationResult !== StatusCode.OK) {
      throw new AppError("Could not verify OTP.", verificationResult);
    }

    registration.phone.isVerified = true;
    registration.phone.otp = undefined;

    const updation = await this.registrationRepository.merge(registration);
    if (updation != StatusCode.OK) {
      throw new AppError("Could not update database.", StatusCode.INTERNAL_ERROR);
    }

    return { message: "Phone has been verified." };
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  otpManager: IOTPManager;
}

interface Input {
  signupId: string;
  otp: string;
}

interface Output {
  message: string;
}