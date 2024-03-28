import { IAccountIDGenerator } from "../../interfaces/services/IAccountIdGenerator.js";
import { User } from "../../domain/entities/User.js";
import { IUseCase } from "../shared/IUseCase.js";
import IUserRepository from "../../interfaces/repositories/IUserRepository.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";

export default class CreateAccount implements IUseCase<Input, StatusCode> {
  private readonly userRepository: IUserRepository;
  private readonly accountIdGenerator: IAccountIDGenerator;

  constructor({ userRepository, accountIdGenerator }: Dependencies) {
    this.userRepository = userRepository;
    this.accountIdGenerator = accountIdGenerator;
  }

  async execute({
    name,
    email,
    phone,
    dateOfBirth,
  }: Input): Promise<StatusCode> {
    const user = new User({
      name,
      email,
      phone,
      dateOfBirth,
    });

    const existingUser = await this.userRepository.findUser(user);
    if (existingUser) {
      // https://www.upguard.com/blog/what-is-an-enumeration-attack
      throw new AppError("Invalid credentials.", StatusCode.BAD_REQUEST);
    }

    const accountId = await this.accountIdGenerator.generate();
    user.accountId = accountId;

    const accountStatus = await this.userRepository.persist(user);
    if (accountStatus !== StatusCode.CREATED) {
      throw new AppError("Invalid credentials.", accountStatus);
    }

    return StatusCode.CREATED;
  }
}

interface Dependencies {
  userRepository: IUserRepository;
  accountIdGenerator: IAccountIDGenerator;
}

interface Input {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
}
