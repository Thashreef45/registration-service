import { BaseProfile } from "../../domain/entities/BaseProfile.js";
import { OrganizationProfile } from "../../domain/entities/OrganizationProfile.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";

export default interface IGraphRepository {
  findByGiggrId(giggrId: string): Promise<BaseProfile | OrganizationProfile | null>;
  findByPhone(phone: string): Promise<BaseProfile | null>;
  findByEmail(email: string): Promise<BaseProfile | null>;
  createBaseProfile(profile: BaseProfile): Promise<StatusCode>;
  createOrganization(organization: OrganizationProfile): Promise<StatusCode>;
}
