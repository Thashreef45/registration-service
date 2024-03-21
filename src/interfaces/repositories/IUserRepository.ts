import { User } from "@entities/User.js";

export default interface IUserRepository {
    findById(id: string): Promise<User>;
}