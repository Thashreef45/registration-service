import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import { IOTPManager } from "../../interfaces/services/IOTPManager.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";

export default class VerifyPhoneWithOTP implements IUseCase<Input, StatusCode> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly otpManager: IOTPManager;

  constructor({ registrationRepository, otpManager }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.otpManager = otpManager;
  }

  async execute({ signupId, phone, otp }: Input): Promise<StatusCode> {

    const registration = await this.registrationRepository.findByUUID(signupId);
    if (!registration) {
        throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }
    
    const verificationResult = await this.otpManager.verify(phone, otp);
    if (verificationResult !== StatusCode.OK) {
      throw new AppError("Could not verify OTP.", verificationResult);
    }

    registration.otpVerified = true;

    await this.registrationRepository.merge(registration);
    
    return verificationResult;
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  otpManager: IOTPManager;
}

interface Input {
  signupId: string;
  phone: string;
  otp: string;
}
