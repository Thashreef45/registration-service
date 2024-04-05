import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { ITokenGenerator } from "../../interfaces/services/ITokenGenerator.js";
import { IOTPManager } from "../../interfaces/services/IOTPManager.js";
import { IEmailService } from "../../interfaces/services/IEmailService.js";
import IOAuthManager from "../../interfaces/services/IOauthManager.js";
import { Registration } from "../../domain/entities/Registration.js";

interface PrefilledData {
  email?: {
    id?: string;
    isVerified?: boolean;
  };
  phone?: {
    number?: string;
    isVerified?: boolean;
  };
  name?: string;
  dateofBirth?: string;
}


export default class GoogleAutofill implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly tokenGenerator: ITokenGenerator;
  private readonly oAuthManager: IOAuthManager;

  constructor({ registrationRepository, tokenGenerator, oAuthManager }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.tokenGenerator = tokenGenerator;
    this.oAuthManager = oAuthManager;
  }

  async execute({ code }: Input): Promise<Output> {

    const user = await this.oAuthManager.getUser(code);
    // turn this user into a JWT payload

    if (!user) {
      throw new AppError("Could not retrieve necessary data.", StatusCode.BAD_REQUEST)
    }

    const dataPayload: PrefilledData = {};
    if (user.email.id) {
      dataPayload.email = user.email;
    }

    if (user.name) {
      dataPayload.name = user.name;
    }

    if (user.dateOfBirth) {
      dataPayload.dateofBirth = String(user.dateOfBirth);
    }

    if (user.phone.number) {
      dataPayload.phone = user.phone;
    }

    const securePayload = this.tokenGenerator.generate(dataPayload);

    return {
      autofillToken: securePayload
    }
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  tokenGenerator: ITokenGenerator;
  oAuthManager: IOAuthManager;
}

interface Input {
  code: string;
}

interface Output {
  autofillToken: string;
}