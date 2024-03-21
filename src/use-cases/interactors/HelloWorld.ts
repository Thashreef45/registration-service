import { IUseCase } from "../shared/IUseCase.js";
import IUserRepository from "@interfaces/repositories/IUserRepository.js";

export default class HelloWorld implements IUseCase<Input, Output> {
    private readonly userRepository: IUserRepository;

    constructor({ userRepository }: Dependencies) {
        this.userRepository = userRepository;
    }

    async execute(input: Input): Promise<Output | Error> {

        const user = await this.userRepository.findById("abc");

        return { message: "Hello World"};
    }
}

interface Dependencies {
    userRepository: IUserRepository;
}

interface Input {
    message: string;
}

interface Output {
    message: string;
}