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
        if (!registration || registration.giggrId) {
            throw new AppError("No registration found", StatusCode.NOT_FOUND);
        }

        if (name) {
            registration.name = name;
        }

        // todo: optionally could force change a verified email
        if (email && !registration.email.isVerified) {
            const doesEmailExist = await this.registrationRepository.findByEmail(email);
            if (doesEmailExist && doesEmailExist.email.isVerified) {
                throw new AppError("Credentials are invalid.", StatusCode.BAD_REQUEST);
            }
            registration.email.id = email;
            // todo: depending on entity, must be validated again.
        }

        if (phone && !registration.phone.isVerified) {
            const doesPhoneExist = await this.registrationRepository.findByPhone(phone);
            if (doesPhoneExist && doesPhoneExist.email.isVerified) {
                throw new AppError("Credentials are invalid.", StatusCode.BAD_REQUEST);
            }
            registration.phone.number = phone;
        }

        if (dateOfBirth) {
            const currentDate = new Date();
            const ageInYears = currentDate.getFullYear() - dateOfBirth.getFullYear();
            
            if (ageInYears > 100 || ageInYears < 8) {
                throw new AppError("Age exceeds limits (must be between 100 and 8)", StatusCode.BAD_REQUEST);
            }

            if (ageInYears >= 18) {
                registration.approval.isApproved = true;
            } else {
                registration.approval.isRequired = true;
                registration.approval.isFrom = "guardian";
            }

            registration.dateOfBirth = dateOfBirth;
        }

        const updation = await this.registrationRepository.merge(registration);
        if (updation !== StatusCode.OK) {
            throw new AppError("Could not update user.", updation);
        }

        return { 
            message: `Data successfully updated. ${registration.approval.isRequired ? "Awaits approval." : ""}` 
        };
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