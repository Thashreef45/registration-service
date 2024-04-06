import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import { ITokenGenerator } from "../../interfaces/services/ITokenGenerator.js";
import { IOTPManager } from "../../interfaces/services/IOTPManager.js";
import { IEmailService } from "../../interfaces/services/IEmailService.js";
import IGraphRepository from "../../interfaces/repositories/IGraphRepository.js";
import { OrganizationProfile } from "../../domain/entities/OrganizationProfile.js";

export default class LoginRequest implements IUseCase<Input, Output> {
  private readonly graphRepository: IGraphRepository;
  private readonly tokenGenerator: ITokenGenerator;
  private readonly otpManager: IOTPManager;
  private readonly emailService: IEmailService;

  constructor({ graphRepository, tokenGenerator, otpManager, emailService }: Dependencies) {
    this.graphRepository = graphRepository;
    this.tokenGenerator = tokenGenerator;
    this.otpManager = otpManager;
    this.emailService = emailService;
  }

  async execute({ identifier, prefer }: Input): Promise<Output> {

    const baseProfile = (await this.graphRepository.findByGiggrId(identifier)) ??
      (await this.graphRepository.findByEmail(identifier)) ??
      (await this.graphRepository.findByPhone(identifier));


    if (!baseProfile) {
      throw new AppError("Invalid credentials", StatusCode.NOT_FOUND);
    }

    if (baseProfile instanceof OrganizationProfile) {
      throw new AppError("Organization unavailable", StatusCode.FORBIDDEN);
    }

    const obj = { prefer: prefer, giggrId: baseProfile.giggrId };
    const token = this.tokenGenerator.generate(obj);

    if (prefer === "link") {
      const link = `http://localhost:3000/login/${token}`;
      const emailStatus = await this.emailService.sendEmail(
        baseProfile.email,
        "Login MFA from Giggr",
        `<p>Your magic link is: <a href="${link}">click me</a></p>`
      );

      if (emailStatus !== StatusCode.OK) {
        throw new AppError("An error occured with sending magic link.", emailStatus);
      }

      return { message: "Check your email for link." };
    } else {
      const otpTemp = await this.otpManager.generate(6);

      const otpStatus = await this.otpManager.send(baseProfile.phone, otpTemp);
      if (otpStatus !== StatusCode.OK) {
        throw new AppError("An error occured with sending OTP.", otpStatus);
      }

      return { loginToken: token, message: "Check your phone for OTP" };
    }
  }
}

interface Dependencies {
  graphRepository: IGraphRepository;
  tokenGenerator: ITokenGenerator;
  otpManager: IOTPManager;
  emailService: IEmailService;
}

interface Input {
  /** Identifier could be giggrId, email, or phone number. */
  identifier: string;
  /** Whether the user prefers a magic link or an OTP */
  prefer: "link" | "otp";
}

interface Output {
  /** The jwt that we provide to let them login. */
  loginToken?: string;
  message: string;
}