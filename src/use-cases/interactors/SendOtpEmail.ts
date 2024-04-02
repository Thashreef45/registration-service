import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";

export default class SendEmailOTP implements IUseCase<Input, Output> {
    private readonly registrationRepository: IRegistrationRepository;

    constructor({ registrationRepository }:Dependencies) {
        this.registrationRepository = registrationRepository;
    }

    async execute({ uuid }: Input): Promise<Output> {

        const otp = this.GenerateOtp()

        const isExist = await this.registrationRepository.findByUUID(uuid)
            if(!isExist) throw new AppError("Couldn't find user",StatusCode.NOT_FOUND)
        else {

            //Todo : Send email, keep the otp in db
        }


        //remove after work
        return {message:""}
        
    }

    private GenerateOtp():number {
        return Number(Math.random().toString().split("").slice(2,8).join(""))
    }
}

interface Dependencies {
    registrationRepository: IRegistrationRepository;
}

interface Input {
    uuid: string;
}

interface Output {
   message : string,
}