import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import { IOTPManager } from "../../interfaces/services/IOTPManager.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";

export default class RequestPhoneOTP implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly otpManager: IOTPManager;

  constructor({ registrationRepository, otpManager }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.otpManager = otpManager;
  }

  async execute({ signupId, phone }: Input): Promise<Output> {

    const registration = await this.registrationRepository.findByUUID(signupId);
    if (!registration) {
        throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }

    if (registration.phone.isVerified) {
      throw new AppError("Phone already verified.", StatusCode.CONFLICT);
    }

    // todo: make sure phone number is valid
    if (phone && !registration.phone.number) {
      registration.phone.number = phone;
    }

    if (!registration.phone.number) {
      throw new AppError("No number associated.", StatusCode.NOT_FOUND);
    }

    registration.phone.otp = await this.otpManager.generate(6);

    const otpStatus = await this.otpManager.send(registration.phone.number, registration.phone.otp);
    if (otpStatus !== StatusCode.OK) {
      throw new AppError("An error occured with sending OTP.", otpStatus);
    }

    const updation = await this.registrationRepository.merge(registration);
    if (updation != StatusCode.OK) {
      throw new AppError("Could not update database.", StatusCode.INTERNAL_ERROR);
    }

    return { message: "OTP has been sent." };
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  otpManager: IOTPManager;
}

interface Input {
  signupId: string;
  phone?: string;
}

interface Output {
  message: string;
}
