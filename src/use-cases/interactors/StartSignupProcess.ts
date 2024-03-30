import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { Registration } from "../../domain/entities/Registration.js";
import { IUUIDGenerator } from "../../interfaces/services/IUUIDGenerator.js";

export default class StartSignupProcess implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly uuidGenerator: IUUIDGenerator;

  constructor({ registrationRepository, uuidGenerator }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.uuidGenerator = uuidGenerator;
  }

  async execute({ dateOfBirth }: Input): Promise<Output> {

    // todo: they must be older than 8
    if (dateOfBirth > new Date()) {
      throw new AppError("Given date is in the future.", StatusCode.BAD_REQUEST);
    }

    const uuid = this.uuidGenerator.generate();

    const registration = new Registration({
      uuid,
      dateOfBirth
    });

    const didPersist = await this.registrationRepository.persist(registration);
    if (didPersist != StatusCode.CREATED) {
      throw new AppError("Could not persist registration.", StatusCode.INTERNAL_ERROR);
    }

    return {
      signupId: uuid
    }
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  uuidGenerator: IUUIDGenerator;
}

interface Input {
  /** The single mandatory field to initiate signup process. */
  dateOfBirth: Date;
}

interface Output {
  /** An UUID to identify this specific signup entity/instance. */
  signupId: string;
}