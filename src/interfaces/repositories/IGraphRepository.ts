import { BaseProfile } from "../../domain/entities/BaseProfile.js";
import { Organization } from "../../domain/entities/Organization.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";

export default interface IBaseProfileRepository {
    findByGiggrId(giggrId: string): Promise<BaseProfile | Organization | null>;
    findByPhone(phone: string): Promise<BaseProfile | null>;
    findByEmail(email: string): Promise<BaseProfile | null>;
    createBaseProfile(profile: BaseProfile): Promise<StatusCode>;
    createOrganization(organization: Organization): Promise<StatusCode>;
}
