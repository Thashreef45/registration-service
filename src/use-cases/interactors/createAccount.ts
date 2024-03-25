import IUserRepository from "@interfaces/repositories/IUserRepository.js";
import StatusCode from "../shared/StatusCodes.js";
import crypto from "crypto";

class CreateAccount {
  private respository: any;
  constructor({ userRepository }: Dependencies) {
    this.respository = userRepository;
  }

  async execute(data: Input): Promise<Output | Error> {
    const newData = { ...data, lifeId: this.createLifeId() };
    let res = await this.respository.createNewUser(newData);
    if (res.success)
      return { message: "User created", status: StatusCode.CREATED };
    else return { message: "User already exists", status: StatusCode.CONFLICT };
  }

  private createLifeId() {
    const random =
      parseInt(crypto.randomBytes(7).toString("hex").toUpperCase(), 16) %
      1000000000000000;
    return random;
  }
}

interface Input {
  name: string;
  email: string;
  phone: string;
  dob: Date;
}

interface Output {
  message: string;
  status: number;
}

interface Dependencies {
  userRepository: IUserRepository;
}

export default CreateAccount;
