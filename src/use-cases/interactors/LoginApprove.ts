import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IGraphRepository from "../../interfaces/repositories/IGraphRepository.js";
import { ITokenGenerator } from "../../interfaces/services/ITokenGenerator.js";
import { IOTPManager } from "../../interfaces/services/IOTPManager.js";
import { OrganizationProfile } from "../../domain/entities/OrganizationProfile.js";

export default class LoginApprove implements IUseCase<Input, Output> {
  private readonly graphRepository: IGraphRepository;
  private readonly tokenGenerator: ITokenGenerator;
  private readonly otpManager: IOTPManager;

  constructor({ graphRepository, tokenGenerator, otpManager }: Dependencies) {
    this.graphRepository = graphRepository;
    this.tokenGenerator = tokenGenerator;
    this.otpManager = otpManager;
  }

  async execute({ loginToken, otp }: Input): Promise<Output> {

    const data = this.tokenGenerator.verify(loginToken) as LoginToken | null;
    if (!data) {
        throw new AppError("invalid token", StatusCode.BAD_REQUEST);
    }

    if (data.prefer === "otp" && !otp) {
      // If they preferred OTP login, but no OTP was given.
      throw new AppError("OTP not given.", StatusCode.BAD_REQUEST);
    }

    const baseProfile = await this.graphRepository.findByGiggrId(data.giggrId);
    if (!baseProfile) {
      throw new AppError("invalid credentials", StatusCode.UNAUTHORIZED);
    }

    if (baseProfile instanceof OrganizationProfile) {
      throw new AppError("organization unavailable", StatusCode.BAD_REQUEST);
    }

    // if they prefer OTP, we need otp verified via twilio to grant them login token
    if (data.prefer === "otp") {
      const verificationResult = await this.otpManager.verify(baseProfile.phone, otp!);
      if (verificationResult !== StatusCode.OK) {
        throw new AppError("Could not verify OTP.", verificationResult);
      }
    }

    const accessTokenPayload = { access: true, giggrId: baseProfile.giggrId };
    const accessToken = this.tokenGenerator.generate(accessTokenPayload);
    return { accessToken };
  }
}

interface Dependencies {
  graphRepository: IGraphRepository;
  tokenGenerator: ITokenGenerator;
  otpManager: IOTPManager;
}

interface Input {
  loginToken: string;
  otp?: string;
}

interface Output {
  /** JWT Access token for session persistence. */
  accessToken: string;
}

interface LoginToken {
  prefer: "link" | "otp";
  giggrId: string;
}