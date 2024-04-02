import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { IAccountIDGenerator } from "../../interfaces/services/IAccountIdGenerator.js";

export default class FinishRegistration implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly accountIdGenerator: IAccountIDGenerator;

  constructor({ registrationRepository, accountIdGenerator }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.accountIdGenerator = accountIdGenerator;
  }

  async execute({ signupId }: Input): Promise<Output> {

    const registration = await this.registrationRepository.findByUUID(signupId);
    if (!registration) {
        throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }
    
    const giggrId = await this.accountIdGenerator.generate();

    const updation = await this.registrationRepository.merge(registration);
    if (updation != StatusCode.OK) {
      throw new AppError("Could not update database.", StatusCode.INTERNAL_ERROR);
    }

    return { message: "Account has been created.", giggrId: giggrId };
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  accountIdGenerator: IAccountIDGenerator;
}

interface Input {
  signupId: string;
}

interface Output {
  message: string;
  giggrId: string;
}