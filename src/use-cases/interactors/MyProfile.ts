import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IGraphRepository from "../../interfaces/repositories/IGraphRepository.js";
import { ITokenGenerator } from "../../interfaces/services/ITokenGenerator.js";
import { OrganizationProfile } from "../../domain/entities/OrganizationProfile.js";
import { BaseProfile } from "../../domain/entities/BaseProfile.js";

interface AccessToken {
  giggrId: string;
  access: boolean;
}

export default class MyProfile implements IUseCase<Input, BaseProfile | OrganizationProfile> {
  private readonly graphRepository: IGraphRepository;
  private readonly tokenGenerator: ITokenGenerator;

  constructor({ graphRepository, tokenGenerator }: Dependencies) {
    this.graphRepository = graphRepository;
    this.tokenGenerator = tokenGenerator;
  }

  async execute({ accessToken }: Input): Promise<BaseProfile | OrganizationProfile> {

    const data = this.tokenGenerator.verify(accessToken) as AccessToken | null;
    if (!data) {
        throw new AppError("invalid token", StatusCode.BAD_REQUEST);
    }

    let baseProfile = await this.graphRepository.findByGiggrId(data.giggrId);
    if (!baseProfile) {
        throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }

    return baseProfile;
  }
}

interface Dependencies {
  graphRepository: IGraphRepository;
  tokenGenerator: ITokenGenerator;
}

interface Input {
  accessToken: string;
  otp?: string;
}