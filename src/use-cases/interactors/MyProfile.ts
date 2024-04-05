import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { ITokenGenerator } from "../../interfaces/services/ITokenGenerator.js";
import { IOTPManager } from "../../interfaces/services/IOTPManager.js";
import { Registration } from "../../domain/entities/Registration.js";

export default class MyProfile implements IUseCase<Input, Registration> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly tokenGenerator: ITokenGenerator;

  constructor({ registrationRepository, tokenGenerator }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.tokenGenerator = tokenGenerator;
  }

  async execute({ accessToken }: Input): Promise<Registration> {

    const data: any = this.tokenGenerator.verify(accessToken);
    if (!data) {
        throw new AppError("invalid token", StatusCode.BAD_REQUEST);
    }

    console.log(data);

    let registration = await this.registrationRepository.findByGiggrId(data.giggrID);
    if (!registration) {
        throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }

    return registration;
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  tokenGenerator: ITokenGenerator;
}

interface Input {
  accessToken: string;
  otp?: string;
}