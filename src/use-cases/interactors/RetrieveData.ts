import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";

export default class StartSignupProcess implements IUseCase<Input, Output> {
    private readonly registrationRepository: IRegistrationRepository;

    constructor({ registrationRepository }: Dependencies) {
        this.registrationRepository = registrationRepository;
    }

    async execute({ signupId }: Input): Promise<Output> {

        const registration = await this.registrationRepository.findByUUID(signupId);
        if (!registration) {
            throw new AppError("No registration found", StatusCode.NOT_FOUND);
        }

        return {
            dateOfBirth: registration.dateOfBirth,
            name: registration.name ?? null,
            email: registration.email ?? null,
            emailVerified: registration.emailVerified ?? false,
            phone: registration.phone ?? null,
            phoneVerified: registration.otpVerified ?? false,
        }
        
    }
}

interface Dependencies {
    registrationRepository: IRegistrationRepository;
}

interface Input {
    signupId: string;
}

interface Output {
    dateOfBirth: Date;
    name: string | null;
    email: string | null;
    emailVerified: boolean;
    phone: string | null;
    phoneVerified: boolean;
}