import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { Registration } from "../../domain/entities/Registration.js";

export default class UpdateUserData implements IUseCase<Input, Output> {
    private readonly registrationRepository: IRegistrationRepository;

    constructor({ registrationRepository }: Dependencies) {
        this.registrationRepository = registrationRepository;
    }

    async execute(input: Input): Promise<Output> {

        const data = new Registration({ name: input.name, email: input.email, phone: input.phone, dateOfBirth: input.dateOfBirth })
        const uuid = input.uuid


        if(!uuid) throw new AppError("UUID is missing",StatusCode.UNAUTHORIZED)

        const isExist = await this.registrationRepository.findByUUID(uuid);
        if (!isExist) {
            throw new AppError("No registration found", StatusCode.NOT_FOUND);
        }


        //loop 
        for (const key in data) {
            if(data[key] == null) {
                delete data[key]
            }
        }

        console.log(data,'data')

        const isUpdated = await this.registrationRepository.partialMerge(data)
        if (isUpdated != StatusCode.OK) {
            return { message: "User updated succesfully" }
        } else {
            throw new AppError("Could not update user", StatusCode.INTERNAL_ERROR);
        }
    }
}

interface Dependencies {
    registrationRepository: IRegistrationRepository;
}

interface Input {
    uuid:string
    name?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: Date;
}

interface Output {
    message: string,
}