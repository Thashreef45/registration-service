import { User } from "@entities/User.js";

export default interface IUserRepository {
    findById(id: string): Promise<User>;
    createNewUser(data:{name : string,email :string,phone : string,dob : string}):any;
}