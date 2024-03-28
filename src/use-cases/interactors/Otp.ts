import { User } from "../../domain/entities/User.js";
import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IUserRepository from "../../interfaces/repositories/IUserRepository.js";
import { IOTPGenerator } from "../../interfaces/services/IOtpGenerator.js";
import { ISMSService } from "../../interfaces/services/ISMSSender.js";
import { IOTPVerificationService } from "../../interfaces/services/IOTPVerificationService.js";

export default class OTPVerificartionService
  implements IUseCase<Input, StatusCode>
{
  private readonly userRepository: IUserRepository;
  // private readonly otpGenerator: IOTPGenerator;
  // private readonly smsSender: ISMSService;
  private readonly twilioVerificationService;

  constructor({ userRepository, twilioVerificationService }: Dependencies) {
    this.userRepository = userRepository;
    this.twilioVerificationService = twilioVerificationService;
    // this.otpGenerator = otpGenerator;
    // this.smsSender = smsSender;
  }

  async execute({ name, phone, dateOfBirth }: Input): Promise<StatusCode> {
    const user = new User({
      name,
      phone,
      dateOfBirth,
    });

    const existingUser = await this.userRepository.findByPhone(phone);
    if (existingUser) {
      // https://www.upguard.com/blog/what-is-an-enumeration-attack
      throw new AppError("Invalid credentials.", StatusCode.BAD_REQUEST);
    }

    // const OTP = this.otpGenerator.generate();
    // user.OTP = OTP;
    // const message = `the OTP for giggr registeration is ${OTP}`; //make this message fancy.
    // await this.smsSender.sendSMS(phone, message);

    // console.log("otp:", OTP);    //delete in future
    const twilioRes = await this.twilioVerificationService.generateAndSend(
      phone
    );
    console.log(twilioRes); // debugging
    const accountStatus = await this.userRepository.persist(user);
    if (accountStatus !== StatusCode.CREATED) {
      throw new AppError("Invalid credentials.", accountStatus); //should change this into appropriate error code and message(probably mongo server error)
    }
    return StatusCode.CREATED;
  }
}

interface Dependencies {
  userRepository: IUserRepository;
  twilioVerificationService: IOTPVerificationService;
}

interface Input {
  name: string;
  phone: string;
  dateOfBirth: Date;
}
