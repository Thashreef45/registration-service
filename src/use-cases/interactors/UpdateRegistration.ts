import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";

export default class UpdateRegistration implements IUseCase<Input, Output> {
    private readonly registrationRepository: IRegistrationRepository;

    constructor({ registrationRepository }: Dependencies) {
        this.registrationRepository = registrationRepository;
    }

    async execute({ signupId, name, email, phone, dateOfBirth }: Input): Promise<Output> {

        const registration = await this.registrationRepository.findByUUID(signupId);
        if (!registration) {
            throw new AppError("No registration found", StatusCode.NOT_FOUND);
        }

        if (name) {
            registration.name = name;
        }

        // todo: optionally could force change a verified email
        if (email && !registration.email.isVerified) {
            registration.email.id = email;
        }

        if (phone && !registration.phone.isVerified) {
            registration.phone.number = phone;
        }

        if (dateOfBirth) {
            registration.dateOfBirth = dateOfBirth;
        }

        const updation = await this.registrationRepository.merge(registration);
        if (updation !== StatusCode.OK) {
            throw new AppError("Could not update user.", updation);
        }

        return { message: "Data successfully updated." };
    }
}

interface Dependencies {
    registrationRepository: IRegistrationRepository;
}

interface Input {
    signupId :string
    name?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: Date;
}

interface Output {
    message: string,
}