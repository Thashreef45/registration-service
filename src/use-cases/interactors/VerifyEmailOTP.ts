import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";

export default class VerifyEmailOTP implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;

  constructor({ registrationRepository }: Dependencies) {
    this.registrationRepository = registrationRepository;
  }

  async execute({ signupId, otp }: Input): Promise<Output> {

    const registration = await this.registrationRepository.findByUUID(signupId);
    if (!registration || registration.giggrId) {
        throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }
    
    // todo: implement timeSafeEqual
    const verificationResult = registration.email.otp === otp;
    if (!verificationResult) {
      throw new AppError("Could not verify OTP.", StatusCode.UNAUTHORIZED);
    }

    registration.email.isVerified = true;
    registration.email.otp = undefined;

    const updation = await this.registrationRepository.merge(registration);
    if (updation != StatusCode.OK) {
      throw new AppError("Could not update database.", StatusCode.INTERNAL_ERROR);
    }

    return { message: "Email has been verified." };
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
}

interface Input {
  signupId: string;
  // todo: phone: string; ? 
  otp: string;
}

interface Output {
  message: string;
}