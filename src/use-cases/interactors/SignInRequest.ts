import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { ITokenGenerator } from "../../interfaces/services/ITokenGenerator.js";
import { IOTPManager } from "../../interfaces/services/IOTPManager.js";
import { IEmailService } from "../../interfaces/services/IEmailService.js";

export default class SignInRequest implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly tokenGenerator: ITokenGenerator;
  private readonly otpManager: IOTPManager;
  private readonly emailService: IEmailService;

  constructor({ registrationRepository, tokenGenerator, otpManager, emailService }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.tokenGenerator = tokenGenerator;
    this.otpManager = otpManager;
    this.emailService = emailService;
  }

  async execute({ identifier, prefer }: Input): Promise<Output> {

    let registration = await this.registrationRepository.findByGiggrId(identifier);
    if (!registration) {
      registration = await this.registrationRepository.findByEmail(identifier);
    }
    if (!registration) {
      registration = await this.registrationRepository.findByPhone(identifier);
    }
    // const registration = await this.registrationRepository.findByGiggrId(identifier);
    if (!registration) {
      throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }

    const obj = { preferred: prefer, giggrId: registration.giggrId };
    const token = this.tokenGenerator.generate(obj);
    if (prefer === "otp") {
      registration.phone.otp = await this.otpManager.generate(6);

      const otpStatus = await this.otpManager.send(registration.phone.number ?? '', registration.phone.otp);
      if (otpStatus !== StatusCode.OK) {
        throw new AppError("An error occured with sending OTP.", otpStatus);
      }
    } else if (prefer === "link") {
      // registration.email.otp = this.GenerateOTP()
      const link = `http://localhost:3000/signin/${token}`
      const otpStatus = await this.emailService.sendEmail(
        registration.email.id || '',
        "Login MFA from Giggr",
        `<p>Your magic link is: <a href="${link}">click me</a></p>`
      );

      if (otpStatus !== StatusCode.OK) {
        throw new AppError("An error occured with sending magic link.", otpStatus);
      }
    }

    return { loginToken: token };

    // // todo: implement timeSafeEqual
    // const verificationResult = registration.email.otp === otp;
    // if (!verificationResult) {
    //   throw new AppError("Could not verify OTP.", StatusCode.UNAUTHORIZED);
    // }

    // registration.email.isVerified = true;
    // registration.email.otp = undefined;

    // const updation = await this.registrationRepository.merge(registration);
    // if (updation != StatusCode.OK) {
    //   throw new AppError("Could not update database.", StatusCode.INTERNAL_ERROR);
    // }

    // return { message: "Email has been verified." };
  }

  private GenerateOTP = () => {
    return Math.random().toString().split("").slice(2, 8).join("")
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  tokenGenerator: ITokenGenerator;
  otpManager: IOTPManager;
  emailService: IEmailService;
}

interface Input {
  identifier: string;
  prefer: "link" | "otp";
}

interface Output {
  loginToken: string;
}