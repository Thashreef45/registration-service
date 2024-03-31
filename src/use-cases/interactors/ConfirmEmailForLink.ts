import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { IEmailService } from "../../interfaces/services/IEmailSender.js";

export default class ConfirmEmailForLink implements IUseCase<Input, StatusCode> {
    private readonly registrationRepository: IRegistrationRepository;
    private readonly emailService: IEmailService;

    constructor({ registrationRepository, emailService }: Dependencies) {
        this.registrationRepository = registrationRepository;
        this.emailService = emailService;
    }

    async execute({ signupId, email }: Input): Promise<StatusCode> {

        const registration = await this.registrationRepository.findByUUID(signupId);
        if (!registration) {
            throw new AppError("No registration found", StatusCode.NOT_FOUND);
        }

        if (registration.emailVerified) {
            throw new AppError("Email already verified", StatusCode.CONFLICT);
        }

        // todo: make sure email is valid, check Neo4j as well

        registration.email = email;

        //! critical security risk
        // todo: turn it into JWT
        const magicLink = `http://localhost:3000/signup/verify/${signupId}`
        // a frontend specific link

        const emailStatus = await this.emailService.sendEmail(
            email, 
            "Verify your Giggr Account", 
            `<p><a href="${magicLink}">Click here</a> to verify your <b>Giggr</b> account.</p>`
        )
        if (emailStatus !== StatusCode.OK) {
            throw new AppError("An error occured with sending email.", emailStatus);
        }

        await this.registrationRepository.merge(registration);
        return emailStatus;
    }
}

interface Dependencies {
    registrationRepository: IRegistrationRepository;
    emailService: IEmailService;
}

interface Input {
    signupId: string;
    email: string;
}
