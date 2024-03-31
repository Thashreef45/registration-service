import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import { IOTPManager } from "../../interfaces/services/IOTPManager.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";

export default class ConfirmPhoneForOTP implements IUseCase<Input, StatusCode> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly otpManager: IOTPManager;

  constructor({ registrationRepository, otpManager }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.otpManager = otpManager;
  }

  async execute({ signupId, phone }: Input): Promise<StatusCode> {

    const registration = await this.registrationRepository.findByUUID(signupId);
    if (!registration) {
        throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }

    if (registration.otpVerified) {
      throw new AppError("Account already verified.", StatusCode.CONFLICT);
    }

    // todo: make sure phone number is valid

    registration.phone = phone;
    registration.otpRequested = true;
    
    const otp = await this.otpManager.generate(6);
    const otpStatus = await this.otpManager.send(phone, otp);
    if (otpStatus !== StatusCode.OK) {
      throw new AppError("An error occured with sending OTP.", otpStatus);
    }

    await this.registrationRepository.merge(registration);
    return otpStatus;
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  otpManager: IOTPManager;
}

interface Input {
  signupId: string;
  phone: string;
}
