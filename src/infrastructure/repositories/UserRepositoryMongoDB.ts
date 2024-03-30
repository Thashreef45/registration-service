import StatusCode from "../../use-cases/shared/StatusCodes.js";
import { User } from "../../domain/entities/User.js";
import IUserRepository from "../../interfaces/repositories/IUserRepository.js";
import Account, {
  AccountDocument,
} from "../database/mongoose/models/Account.js";

export class UserRepositoryMongoDB implements IUserRepository {
  async persist(user: User): Promise<StatusCode> {
    try {
      const newUser = new Account(user);
      await newUser.save();
      return StatusCode.CREATED;
    } catch (error) {
      console.error("Error persisting user:", error);
      return StatusCode.INTERNAL_ERROR;
    }
  }

  async merge(user: User): Promise<StatusCode> {
    try {
      // todo: Only send changed fields over to mongoose.
      await Account.findOneAndUpdate({ accountId: user.accountId }, user);
      return StatusCode.OK;
    } catch (error) {
      // todo: Identify which error Mongoose throws and return the code accordingly.
      console.error("Error merging user:", error);
      return StatusCode.INTERNAL_ERROR;
    }
  }

  async remove(user: User): Promise<StatusCode> {
    try {
      await Account.deleteOne({ accountId: user.accountId });
      return StatusCode.OK;
    } catch (error) {
      // todo: Identify which error Mongoose throws and return the code accordingly.
      console.error("Error removing user:", error);
      return StatusCode.INTERNAL_ERROR;
    }
  }

  async removeByAccountId(accountId: string): Promise<User | null> {
    try {
      const user = await Account.findOneAndDelete({ accountId });
      return UserRepositoryMongoDB.mapUserToEntity(user);
    } catch (error) {
      console.error("Error removing user by accountId:", error);
      return null;
    }
  }

  async findByAccountId(accountId: string): Promise<User | null> {
    try {
      const user = await Account.findOne({ accountId });
      return UserRepositoryMongoDB.mapUserToEntity(user);
    } catch (error) {
      console.error("Error in finding by accountId:", error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await Account.findOne({ email });
      return UserRepositoryMongoDB.mapUserToEntity(user);
    } catch (error) {
      console.error("Error in finding by email:", error);
      return null;
    }
  }

  async findByPhone(phone: string): Promise<User | null> {
    try {
      const user = await Account.findOne({ phone });
      return UserRepositoryMongoDB.mapUserToEntity(user);
    } catch (error) {
      console.error("Error in finding by email:", error);
      return null;
    }
  }

  async findUser(userEntity: Partial<User>): Promise<User | null> {
    try {
      const user = await Account.findOne(userEntity);
      return UserRepositoryMongoDB.mapUserToEntity(user);
    } catch (error) {
      console.error("Error in finding by email:", error);
      return null;
    }
  }

  private static mapUserToEntity(
    mongooseUser: AccountDocument | null
  ): User | null {
    if (!mongooseUser) return null;

    const user = new User({
      accountId: mongooseUser.accountId,
      name: mongooseUser.name,
      email: mongooseUser.email,
      phone: mongooseUser.phone,
      dateOfBirth: mongooseUser.dateOfBirth,
    });

    return user;
  }
}
