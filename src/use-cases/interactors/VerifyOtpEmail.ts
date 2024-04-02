import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";

export default class VerifyEmailOtp implements IUseCase<Input, Output> {
    private readonly registrationRepository: IRegistrationRepository;

    constructor({registrationRepository}:Dependencies) {
        this.registrationRepository = registrationRepository;
    }

    async execute({ uuid,otp }: Input): Promise<Output> {


        const isExist = await this.registrationRepository.findByUUID(uuid)
        if(!isExist) throw new AppError ("Couldn't find user",StatusCode.NOT_FOUND)
        else {
            //Todo : return create giggrId
        }


        //remove after work
        return {message:""}
        
    }
}

interface Dependencies {
    registrationRepository: IRegistrationRepository;
}

interface Input {
    uuid: string;
    otp : string
}

interface Output {
   message : string,
}