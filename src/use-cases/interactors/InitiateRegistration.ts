import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { Registration } from "../../domain/entities/Registration.js";
import { IUUIDGenerator } from "../../interfaces/services/IUUIDGenerator.js";
import IOrganizationRepository from "../../interfaces/repositories/IOrganizationRepository.js";
import { Organization } from "../../domain/entities/Organization.js";

export default class InitiateRegistration implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  // private readonly organizationRepository: IOrganizationRepository;
  private readonly uuidGenerator: IUUIDGenerator;

  constructor({ registrationRepository, uuidGenerator }: Dependencies) {
    this.registrationRepository = registrationRepository;
    // this.organizationRepository = organizationRepository;
    this.uuidGenerator = uuidGenerator;
  }

  async execute({ entity, deviceId, locationId, networkId }: Input): Promise<Output> {

    const role = entity === "individual" ? "administrator" : "user";
    
    // todo: consider checking the database for the same unique fingerprint
    const userUUID = this.uuidGenerator.generate();
    const registration = new Registration({
      uuid: userUUID,
      entity,
      role,
      deviceId,
      locationId,
      networkId
    });

    const didUserPersist = await this.registrationRepository.persist(registration);
    if (didUserPersist != StatusCode.CREATED) {
      throw new AppError("Could not persist registration.", StatusCode.INTERNAL_ERROR);
    }
    
    // Industries & Institutes
    // if (entity !== "individual") {
    //   const orgUUID = this.uuidGenerator.generate();
    //   const organization = new Organization({
    //     uuid: orgUUID,
    //     adminUUID: userUUID,
    //     entity,
    //     documents: "awaiting"
    //   });

    //   const didOrgPersist = await this.organizationRepository.persist(organization);
    //   if (didOrgPersist != StatusCode.CREATED) {
    //     throw new AppError("Could not persist organization.", StatusCode.INTERNAL_ERROR);
    //   }
    // }

    return {
      signupId: userUUID
    }
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  // organizationRepository: IOrganizationRepository;
  uuidGenerator: IUUIDGenerator;
}

interface Input {
  entity: "individual" | "industry" | "institute";
  deviceId: string;
  locationId: string;
  networkId: string;
}

interface Output {
  /** An UUID to identify this specific signup entity/instance. */
  signupId: string;
}