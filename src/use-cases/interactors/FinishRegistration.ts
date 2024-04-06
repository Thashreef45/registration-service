import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { IAccountIDGenerator } from "../../interfaces/services/IAccountIdGenerator.js";
import IGraphRepository from "../../interfaces/repositories/IGraphRepository.js";
import { BaseProfile } from "../../domain/entities/BaseProfile.js";
import { Organization } from "../../domain/entities/Organization.js";

export default class FinishRegistration implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly accountIdGenerator: IAccountIDGenerator;
  private readonly graphRepository: IGraphRepository;

  constructor({
    registrationRepository,
    accountIdGenerator,
    graphRepository,
  }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.accountIdGenerator = accountIdGenerator;
    this.graphRepository = graphRepository;
  }

  async execute({ signupId }: Input): Promise<Output> {
    const registration = await this.registrationRepository.findByUUID(signupId);
    if (!registration || registration.giggrId) {
      throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }

    if (
      !registration.name ||
      !registration.dateOfBirth ||
      !registration.email ||
      !registration.phone
    ) {
      throw new AppError("All fields are not filled.", StatusCode.BAD_REQUEST);
    }

    if (!registration.email.isVerified) {
      throw new AppError("Email id is not verified.", StatusCode.BAD_REQUEST);
    }

    if (!registration.phone.isVerified) {
      throw new AppError(
        "Phone number is not verified.",
        StatusCode.BAD_REQUEST
      );
    }

    if (!registration.approval.isApproved) {
      throw new AppError(
        `Awaiting approval from ${registration.approval!.isFrom}.`,
        StatusCode.BAD_REQUEST
      );
    }

    const giggrId = await this.accountIdGenerator.generate();

    registration.giggrId = giggrId;

    // urgent fixme: Send email after registration.

    const updation = await this.registrationRepository.merge(registration);
    if (updation != StatusCode.OK) {
      throw new AppError(
        "Could not update database.",
        StatusCode.INTERNAL_ERROR
      );
    }

    let res;
    if (registration.role === "administrator") {
      // const organization = new Organization({})
      // res = await this.graphRepository.createOrganization(organization);
      // if (res !== StatusCode.CREATED) {
      //   throw new AppError("Could not create graph node", res);
    }

    if (registration.role === "user") {

      const baseProfileData = {
        entity: registration!.entity,
        role: registration!.role,
        locationId: registration!.metadata!.locationId,
        networkId: registration!.metadata!.networkId,
        deviceId: registration!.metadata!.deviceId,
        name: registration!.name,
        email: registration!.email!.id || "",
        phone: registration!.phone!.number || "",
        dateOfBirth: registration!.dateOfBirth,
        giggrId: registration!.giggrId,
      };
      const individualNode = new BaseProfile(baseProfileData);
      res = await this.graphRepository.createBaseProfile(individualNode);
      if (res !== StatusCode.CREATED) {
        throw new AppError("Could not create graph node", res);
      }

    }


    return { message: "Account has been created.", giggrId: giggrId };
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  accountIdGenerator: IAccountIDGenerator;
  graphRepository: IGraphRepository;
}

interface Input {
  signupId: string;
}

interface Output {
  message: string;
  giggrId: string;
}
