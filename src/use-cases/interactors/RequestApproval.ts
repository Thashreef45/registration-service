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

export default class RequestApproval implements IUseCase<Input, Output> {
    private readonly registrationRepository: IRegistrationRepository;
    // private readonly organizationRepository: IOrganizationRepository;
    private readonly uuidGenerator: IUUIDGenerator;
    private readonly emailService: IEmailService;
    private readonly smsService: ISMSService;
    private readonly approvalTokenManager: ITokenManager<IndividualApprovalPayload>;
    // public endStatus: StatusCode = 200;

    constructor({ registrationRepository, smsService, emailService, approvalTokenManager, uuidGenerator }: Dependencies) {
        this.registrationRepository = registrationRepository;
        // this.organizationRepository = organizationRepository;
        this.emailService = emailService;
        this.smsService = smsService;
        this.approvalTokenManager = approvalTokenManager;
        this.uuidGenerator = uuidGenerator;
    }

    async execute({ signupId, phone, email }: Input): Promise<Output> {

        const registration = await this.registrationRepository.findByUUID(signupId);
        if (!registration || registration.giggrId) {
            throw new AppError("No registration found", StatusCode.NOT_FOUND);
        }

        if (registration.entity === "individual" && (!phone && !email)) {
            throw new AppError("Fields `phone` and `email` are not provided.", StatusCode.BAD_REQUEST);
        }

        if (email && (registration.email.id === email)) {
            throw new AppError("Conflict with email.", StatusCode.CONFLICT);
        }
        
        console.log(phone);
        console.log(registration.phone);
        if (phone && (registration.phone.number === phone)) {
            throw new AppError("Conflict with phone.", StatusCode.CONFLICT);
        }

        if (registration.entity === "individual") {
            // guardian approval
            const status = await this.executeIndividual({ phone, email, registration });
            if (status !== StatusCode.OK) {
                throw new AppError("Could not request for approval", StatusCode.INTERNAL_ERROR);
            }
        } else if (registration.entity === "industry") {
            // industrial approval
        } else if (registration.entity === "institute") {
            // institute approval
        }

        const didUserPersist = await this.registrationRepository.merge(registration);
        if (didUserPersist != StatusCode.OK) {
            throw new AppError("Could not update registration.", StatusCode.INTERNAL_ERROR);
        }

        return {
            message: "Requested approval successfully."
        }
    }

    private async executeIndividual({ phone, email, registration }: { phone?: string; email?: string; registration: Registration}) {
        const approvalToken = this.approvalTokenManager.generate({
            phone,
            email,
            uuid: registration.uuid,
        });
        
        const link = `https://localhost:3000/signup/approve/${approvalToken}`;

        const message = `<b>${registration.name}</b> is requesting your approval to sign in to Giggr. <a href="${link}">Click here</a> to approve.`;
        if (email) {
            return await this.emailService.sendEmail(
                email, 
                "Approval for Giggr",
                message
            );
        } else if (phone) {
            return await this.smsService.sendSMS(
                phone,
                message
            );
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
    uuidGenerator: IUUIDGenerator;
    emailService: IEmailService;
    smsService: ISMSService;
    approvalTokenManager: ITokenManager<IndividualApprovalPayload>;
}

interface Input {
    signupId: string;
    email?: string;
    phone?: string;
}

interface Output {
    message: string;
}