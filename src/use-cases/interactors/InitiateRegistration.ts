import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { Registration } from "../../domain/entities/Registration.js";
import { IUUIDGenerator } from "../../interfaces/services/IUUIDGenerator.js";
import IOrganizationRepository from "../../interfaces/repositories/IOrganizationRepository.js";
import { Organization } from "../../domain/entities/Organization.js";
import { ITokenGenerator } from "../../interfaces/services/ITokenGenerator.js";

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

export default class InitiateRegistration implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  // private readonly organizationRepository: IOrganizationRepository;
  private readonly uuidGenerator: IUUIDGenerator;
  private readonly tokenGenerator: ITokenGenerator;

  constructor({ registrationRepository, uuidGenerator, tokenGenerator }: Dependencies) {
    this.registrationRepository = registrationRepository;
    // this.organizationRepository = organizationRepository;
    this.uuidGenerator = uuidGenerator;
    this.tokenGenerator = tokenGenerator;
  }

  async execute({ entity, deviceId, locationId, networkId, autofillToken }: Input): Promise<Output> {

    const role = entity === "individual" ? "administrator" : "user";
    
    // todo: consider checking the database for the same unique fingerprint
    const userUUID = this.uuidGenerator.generate();
    const registration = new Registration({
      uuid: userUUID,
      entity,
      role,
      deviceId,
      locationId,
      networkId,
      needsApproval: false,
      isApproved: false
    });

    // A source such as LinkedIn, Google, and such.
    if (autofillToken) {
      const data = this.tokenGenerator.verify(autofillToken) as PrefilledData | null;
      if (data) {
        if (data.email && data.email.id) {
          registration.email.id = data.email.id;
          if (data.email.isVerified) {
            registration.email.isVerified = true;
          }
        }

        if (data.phone && data.phone.number) {
          registration.phone.number = data.phone.number;
          if (data.phone.isVerified) {
            registration.phone.isVerified = true;
          }
        }

        if (data.name) {
          registration.name = data.name;
        }

        if (data.dateofBirth) {
          registration.dateOfBirth = new Date(data.dateofBirth);
        }
      }
    }

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
  tokenGenerator: ITokenGenerator;
}

interface Input {
  entity: "individual" | "industry" | "institute";
  deviceId: string;
  locationId: string;
  networkId: string;
  autofillToken?: string;
}

interface Output {
  /** An UUID to identify this specific signup entity/instance. */
  signupId: string;
}