import { Organization } from "../../domain/entities/Organization.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";

export default interface IOrganizationRepository {
    /**
     * Persists a new organization entity to the database.
     * @param organization
     */
    persist(organization: Organization): Promise<StatusCode>;

    /**
     * Saves an existing organization entity to the database.
     * @param organization 
     */
    merge(organization: Organization): Promise<StatusCode>;

    /**
     * Removes a organization entity from the database.
     * @param organization
     */
    remove(organization: Organization): Promise<StatusCode>;

    /**
     * Removes a organization from the database by its UUID.
     * @param uuid
     */
    removeByUUID(uuid: string): Promise<Organization | null>;

    /**
     * Retrieve a organization entity from the database by its UUID.
     * @param uuid
     */
    findByUUID(uuid: string): Promise<Organization | null>;

    /**
     * Retrieve a organization entity from the database by its admin UUID.
     * @param adminUUID
     */
    findByAdminUUID(adminUUID: string): Promise<Organization | null>;
}
