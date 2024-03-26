import { User } from "../../domain/entities/User.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";

export default interface IUserRepository {
    /**
     * Persists a new user entity to the database.
     * @param user
     */
    persist(user: User): Promise<StatusCode>;

    /**
     * Saves an existing user entity to the database.
     * @param user 
     */
    merge(user: User): Promise<StatusCode>;
    
    /**
     * Removes an user entity from the database.
     * @param user
     */
    remove(user: User): Promise<StatusCode>;

    /**
     * Removes an user from the database by their account id.
     * @param accountId
     */
    removeByAccountId(accountId: string): Promise<User | null>;

    /**
     * Retrieve an user entity from the database by their account id.
     * @param accountId
     */
    findByAccountId(accountId: string): Promise<User | null>;

    /**
     * Retrieve an user entity from the database by their email address.
     * @param email 
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Retrieve an user entity from the database by their phone number.
     * @param phone 
     */
    findByPhone(phone: string): Promise<User | null>;

    /**
     * Attempt to retrieve a full user entity from a partial entity.
     */
    findUser(user: Partial<User>): Promise<User | null>;
}