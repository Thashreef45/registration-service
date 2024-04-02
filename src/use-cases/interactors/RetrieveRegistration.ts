import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { Registration } from "../../domain/entities/Registration.js";

export default class RetrieveRegistration implements IUseCase<Input, Registration> {
    private readonly registrationRepository: IRegistrationRepository;

    constructor({ registrationRepository }: Dependencies) {
        this.registrationRepository = registrationRepository;
    }

    async execute({ signupId }: Input): Promise<Registration> {

        const registration = await this.registrationRepository.findByUUID(signupId);
        if (!registration) {
            throw new AppError("No registration found", StatusCode.NOT_FOUND);
        }

        return registration;
    }
}

interface Dependencies {
    registrationRepository: IRegistrationRepository;
}

interface Input {
    signupId: string;
}