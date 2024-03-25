import { User } from "../../domain/entities/User.js";
import IUserRepository from "../../interfaces/repositories/IUserRepository.js";
import accountModel from "../database/mongodb/models/accountModel.js";
import { createNewUserInput, createNewUserOutput } from "./repoInterface.js";

export class UserRepositoryMongoDB implements IUserRepository {
  findById(lifeId: string): Promise<User> {
    // todo: fetch from mongo

    const user = new User({
      lifeId: lifeId,
      name: "John Doe",
      dateOfBirth: new Date(),
      email: "john.doe@example.com",
      phone: "+91 0000 00 0000",
    });

    return Promise.resolve(user);
  }

  async createNewUser(data: createNewUserInput): Promise<createNewUserOutput> {
    try {
      const newAccount = new accountModel(data);
      let res = await newAccount.save();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}
