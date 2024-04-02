import { Registration } from "../../domain/entities/Registration.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";

export default interface IRegistrationRepository {
    /**
     * Persists a new registration entity to the database.
     * @param registration
     */
    persist(registration: Registration): Promise<StatusCode>;

    /**
     * Saves an existing registration entity to the database.
     * @param registration 
     */
    merge(registration: Registration): Promise<StatusCode>;

    /**
     * Removes a registration entity from the database.
     * @param registration
     */
    remove(registration: Registration): Promise<StatusCode>;

    /**
     * Removes a registration from the database by its UUID.
     * @param uuid
     */
    removeByUUID(uuid: string): Promise<Registration | null>;

    /**
     * Retrieve a registration entity from the database by its UUID.
     * @param uuid
     */
    findByUUID(uuid: string): Promise<Registration | null>;

    /**
     * Retrieve a registration entity from the database by its email address.
     * @param email 
     */
    findByEmail(email: string): Promise<Registration | null>;

    /**
     * Retrieve a registration entity from the database by its phone number.
     * @param phone 
     */
    findByPhone(phone: string): Promise<Registration | null>;
}
