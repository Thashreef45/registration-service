import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { ITokenGenerator } from "../../interfaces/services/ITokenGenerator.js";
import { IOTPManager } from "../../interfaces/services/IOTPManager.js";

export default class SignInApprove implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly tokenGenerator: ITokenGenerator;
  private readonly otpManager: IOTPManager;

  constructor({ registrationRepository, tokenGenerator, otpManager }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.tokenGenerator = tokenGenerator;
    this.otpManager = otpManager;
  }

  async execute({ accessToken, otp }: Input): Promise<Output> {

    const data: any = this.tokenGenerator.verify(accessToken);
    if (!data) {
        throw new AppError("invalid token", StatusCode.BAD_REQUEST);
    }
    console.log(data);

    if (data.preferred === 'otp' && !otp) {
        throw new AppError("OTP was not given", StatusCode.BAD_REQUEST);
    }

    console.log(data.giggrId);
    console.log("before fetch")
    // const dat = await this.registrationRepository.findByGiggrId("068RJLAX7Y6QBHU1")
    // console.log(dat);
    const registration = await this.registrationRepository.findByGiggrId(data.giggrId);
    if (!registration) {
        throw new AppError("No registration found", StatusCode.NOT_FOUND);
      }
      
    if (!registration.giggrId) {
        throw new AppError("Incomplete registration process", StatusCode.NOT_FOUND);
    }
    
    if (data.preferred === 'otp' && otp) {
        const verificationResult = await this.otpManager.verify(registration.phone.number || '', otp);
        if (verificationResult !== StatusCode.OK) {
          throw new AppError("Could not verify OTP.", verificationResult);
        }
        const access = { access: true, giggrId: registration.giggrId || '' };
        const token = this.tokenGenerator.generate(access);
        return { accessToken: token };
    } else if (data.preferred === 'link') {
        const access = { access: true, giggrId: registration.giggrId || '' };
        const token = this.tokenGenerator.generate(access);
        return { accessToken: token };
    }

    throw new AppError("No flow reached.", StatusCode.INTERNAL_ERROR);
    

    
    // // todo: implement timeSafeEqual
    // const verificationResult = registration.email.otp === otp;
    // if (!verificationResult) {
    //   throw new AppError("Could not verify OTP.", StatusCode.UNAUTHORIZED);
    // }

    // registration.email.isVerified = true;
    // registration.email.otp = undefined;

    // const updation = await this.registrationRepository.merge(registration);
    // if (updation != StatusCode.OK) {
    //   throw new AppError("Could not update database.", StatusCode.INTERNAL_ERROR);
    // }

    // return { message: "Email has been verified." };
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  tokenGenerator: ITokenGenerator;
  otpManager: IOTPManager;
}

interface Input {
  accessToken: string;
  otp?: string;
}

interface Output {
  accessToken: string;
}