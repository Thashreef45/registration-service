import { User } from "../../domain/entities/User.js";
import UserRepository from "../../interfaces/repositories/IUserRepository.js";

export class UserRepositoryMongoDB implements UserRepository {
    findById(lifeId: string): Promise<User> {
        // todo: fetch from mongo
        
        const user = new User({
            lifeId: lifeId,
            name: "John Doe",
            dateOfBirth: new Date(),
            email: "john.doe@example.com",
            phone: "+91 0000 00 0000"
        });

        return Promise.resolve(user);
    }
}