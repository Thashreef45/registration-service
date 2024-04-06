import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { Registration } from "../../domain/entities/Registration.js";
import { IUUIDGenerator } from "../../interfaces/services/IUUIDGenerator.js";
import IOrganizationRepository from "../../interfaces/repositories/IOrganizationRepository.js";
import { Organization } from "../../domain/entities/Organization.js";
import { IEmailService } from "../../interfaces/services/IEmailService.js";
import { ISMSService } from "../../interfaces/services/ISMSSender.js";
import { ITokenManager } from "../../interfaces/services/ITokenManager.js";

export default class AcceptApproval implements IUseCase<Input, Output> {
    private readonly registrationRepository: IRegistrationRepository;
    // private readonly organizationRepository: IOrganizationRepository;
    private readonly emailService: IEmailService;
    private readonly smsService: ISMSService;
    private readonly approvalTokenManager: ITokenManager<IndividualApprovalPayload>;
    // public endStatus: StatusCode = 200;

    constructor({ registrationRepository, smsService, emailService, approvalTokenManager }: Dependencies) {
        this.registrationRepository = registrationRepository;
        // this.organizationRepository = organizationRepository;
        this.emailService = emailService;
        this.smsService = smsService;
        this.approvalTokenManager = approvalTokenManager;
    }

    async execute({ signupId, token }: Input): Promise<Output> {

        const data = this.approvalTokenManager.verify(token);

        const guardianRegistration = await this.registrationRepository.findByUUID(signupId);
        if (!guardianRegistration) {
            throw new AppError("No registration found", StatusCode.NOT_FOUND);
        }

        if (!guardianRegistration.name || !guardianRegistration.dateOfBirth || !guardianRegistration.email || !guardianRegistration.phone) {
            throw new AppError("All fields are not filled.", StatusCode.BAD_REQUEST);
        }

        if (!guardianRegistration.email.isVerified) {
            throw new AppError("Email id is not verified.", StatusCode.BAD_REQUEST);
        }

        if (!guardianRegistration.phone.isVerified) {
            throw new AppError("Phone number is not verified.", StatusCode.BAD_REQUEST);
        }

        const dependentRegistration = await this.registrationRepository.findByUUID(data.uuid);
        if (!dependentRegistration || dependentRegistration.giggrId) {
            throw new AppError("No registration found", StatusCode.NOT_FOUND);
        }

        if (guardianRegistration.email.id === dependentRegistration.email.id) {
            throw new AppError("Conflict of emails", StatusCode.CONFLICT);
        }

        if (guardianRegistration.phone.number === dependentRegistration.phone.number) {
            throw new AppError("Conflict of phone numbers", StatusCode.CONFLICT);
        }

        // -- if industry --
        // urgent fixme: make sure organization extension matches as well.

        dependentRegistration.approval.isApproved = true;

        const didUserPersist = await this.registrationRepository.merge(dependentRegistration);
        if (didUserPersist != StatusCode.OK) {
            throw new AppError("Could not approve the user.", StatusCode.INTERNAL_ERROR);
        }

        this.validateDependentRegistration(dependentRegistration);

        return { message: "Approved account successfully." };
    }

    private validateDependentRegistration(registration: Registration) {
        if (!registration.name || !registration.dateOfBirth || !registration.email || !registration.phone) {
            throw new AppError("Account is approved but fields are incomplete.", StatusCode.BAD_REQUEST);
        }

        if (!registration.email.isVerified) {
            throw new AppError("Account is approved but email is not verified.", StatusCode.BAD_REQUEST);
        }

        if (!registration.phone.isVerified) {
            throw new AppError("Account is approved but phone is not verified.", StatusCode.BAD_REQUEST);
        }
    }
}

interface IndividualApprovalPayload {
    /** The `email` address of the guardian. */
    email?: string;
    /** The `phone` of the guardian. */
    phone?: string;
    /** The uuid of the account to approve. */
    uuid: string;
}


interface Dependencies {
    registrationRepository: IRegistrationRepository;
    // organizationRepository: IOrganizationRepository;
    emailService: IEmailService;
    smsService: ISMSService;
    approvalTokenManager: ITokenManager<IndividualApprovalPayload>;
}

interface Input {
    signupId: string;
    token: string;
}

interface Output {
    message: string;
}