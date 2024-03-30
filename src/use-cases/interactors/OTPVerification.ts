import IUserRepository from "../../interfaces/repositories/IUserRepository.js";
import { IOTPVerificationService } from "../../interfaces/services/IOTPManager.js";
import { AppError } from "../shared/AppError.js";
import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";

export default class OTPVerificationInteractor
  implements IUseCase<Input, StatusCode>
{
  private readonly userRepository: IUserRepository;
  private readonly twilioVerificationService;

  constructor({ userRepository, twilioVerificationService }: Dependencies) {
    this.userRepository = userRepository;
    this.twilioVerificationService = twilioVerificationService;
  }
  async execute({ phone, OTP }: Input): Promise<StatusCode> {
    const twilioResponse = await this.twilioVerificationService.verify(
      phone,
      OTP
    );
    if (twilioResponse != StatusCode.OK) {
      console.log("error at twilio otp verification: verify");
      throw new AppError(
        "Error at verification service of twilio: verify meathod",
        StatusCode.INTERNAL_ERROR
      );
    }
    console.log(twilioResponse); //for debugging delete afterwards
    return StatusCode.OK;
  }
}

interface Input {
  phone: string;
  OTP: string;
}

interface Dependencies {
  userRepository: IUserRepository;
  twilioVerificationService: IOTPVerificationService;
}
