import IUserRepository from "@interfaces/repositories/IUserRepository.js";
import StatusCode from "../shared/StatusCodes.js";


class CreateAccount {
    private respository: any
    constructor({ userRepository }: Dependencies) {
        this.respository = userRepository
    }


    async execute(data: Input): Promise<Output | Error> {
        try {
            const newData = { ...data, lifeId: this.createLifeId() }
            let res = await this.respository.createNewUser(newData)
            if(res.success) return { message: "User created", status: StatusCode.CREATED }
            else return { message: "User created", status: StatusCode.CONFLICT }
        } catch (error) {
            // console.log(error,'error')
            // return  { message: "User not created", status: StatusCode.CONFLICT }
        }
    }

    private createLifeId() {

        //generate lifeId (16 digit unique id ) --pending
        return '1234567890123456'
    }

}



interface Input {
    name: string
    email: string,
    phone: string,
    dob: Date,
}

interface Output {
    message: string;
    status: number
}

interface Dependencies {
    userRepository: IUserRepository;
}

export default CreateAccount