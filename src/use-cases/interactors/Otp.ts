import { User } from "../../domain/entities/User.js";
import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IUserRepository from "../../interfaces/repositories/IUserRepository.js";
import { IOTPGenerator } from "../../interfaces/services/IOtpGenerator.js";

export default class OTPGenerator implements IUseCase<Input, StatusCode> {
  private readonly userRepository: IUserRepository;
  private readonly otpGenerator: IOTPGenerator;

  constructor({ userRepository, otpGenerator }: Dependencies) {
    this.userRepository = userRepository;
    this.otpGenerator = otpGenerator;
  }

  async execute({ name, phone, dateOfBirth }: Input): Promise<StatusCode> {
    const user = new User({
      name,
      phone,
      dateOfBirth,
    });
    const defaultOtpLength = 6;

    const existingUser = await this.userRepository.findByPhone(phone);
    if (existingUser) {
      // https://www.upguard.com/blog/what-is-an-enumeration-attack
      throw new AppError("Invalid credentials.", StatusCode.BAD_REQUEST);
    }

    const OTP = this.otpGenerator.generate(defaultOtpLength);
    user.OTP = OTP;

    const accountStatus = await this.userRepository.persist(user);
    if (accountStatus !== StatusCode.CREATED) {
      throw new AppError("Invalid credentials.", accountStatus); //should change this into appropriate error code and message(probably mongo server error)
    }
    return StatusCode.CREATED;
  }
}

interface Dependencies {
  userRepository: IUserRepository;
  otpGenerator: IOTPGenerator;
}

interface Input {
  name: string;
  phone: string;
  dateOfBirth: Date;
}
