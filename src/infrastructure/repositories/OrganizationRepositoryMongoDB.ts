import { Organization } from "../../domain/entities/Organization.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";
import OrganizationModel, { OrganizationDocument } from "../database/mongoose/models/Organization.Model.js";
import IOrganizationRepository from "../../interfaces/repositories/IOrganizationRepository.js";

export default class OrganizationRepositoryMongoDB implements IOrganizationRepository {

    async persist(organization: Organization): Promise<StatusCode> {
        try {
            await OrganizationModel.create(organization);
            return StatusCode.CREATED;
        } catch (error) {
            console.error("Error persisting organization:", error);
            return StatusCode.INTERNAL_ERROR;
        }
    }

    async merge(organization: Organization): Promise<StatusCode> {
        try {
            await OrganizationModel.findOneAndUpdate({ uuid: organization.uuid }, organization);
            return StatusCode.OK;
        } catch (error) {
            console.error("Error merging organization:", error);
            return StatusCode.INTERNAL_ERROR;
        }
    }

    async remove(organization: Organization): Promise<StatusCode> {
        try {
            await OrganizationModel.findOneAndDelete({ uuid: organization.uuid });
            return StatusCode.OK;
        } catch (error) {
            console.error("Error removing organization:", error);
            return StatusCode.INTERNAL_ERROR;
        }
    }

    async removeByUUID(uuid: string): Promise<Organization | null> {
        try {
            const organizationDocument = await OrganizationModel.findOneAndDelete({ uuid });
            return OrganizationRepositoryMongoDB.mapOrganizationToEntity(organizationDocument);
        } catch (error) {
            console.error("Error removing organization by UUID:", error);
            return null;
        }
    }

    async findByUUID(uuid: string): Promise<Organization | null> {
        try {
            const organizationDocument = await OrganizationModel.findOne({ uuid });
            return OrganizationRepositoryMongoDB.mapOrganizationToEntity(organizationDocument);
        } catch (error) {
            console.error("Error finding organization by UUID:", error);
            return null;
        }
    }

    async findByAdminUUID(adminUUID: string): Promise<Organization | null> {
        try {
            const organizationDocument = await OrganizationModel.findOne({ adminUUID });
            return OrganizationRepositoryMongoDB.mapOrganizationToEntity(organizationDocument);
        } catch (error) {
            console.error("Error finding organization by adminUUID:", error);
            return null;
        }
    }

    private static mapOrganizationToEntity(organizationRegistration: OrganizationDocument | null): Organization | null {
        if (!organizationRegistration) return null;

        const organization = new Organization({
            uuid: organizationRegistration.uuid,
            adminUUID: organizationRegistration.adminUUID,
            name: organizationRegistration.name,
            entity: organizationRegistration.entity,
            extension: organizationRegistration.extension,
            documents: organizationRegistration.documents,
            giggrId: organizationRegistration.giggrId
        });

        return organization;
    }
}