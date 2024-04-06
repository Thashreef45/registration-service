import neo4j from "neo4j-driver";
import env from "../config/environment.js";
import IGraphRepository from "../../interfaces/repositories/IGraphRepository.js";
import { BaseProfile } from "../../domain/entities/BaseProfile.js";
import { Organization } from "../../domain/entities/Organization.js";
import StatusCode from "../../use-cases/shared/StatusCodes.js";
import { OrganizationProfile } from "../../domain/entities/OrganizationProfile.js";

const driver = neo4j.driver(
    env.NEO_URI,
    neo4j.auth.basic(env.NEO_USER, env.NEO_PASSWORD)
);


export default class GraphRepository implements IGraphRepository {
    async findByGiggrId(
        giggrId: string
    ): Promise<BaseProfile | OrganizationProfile | null> {
        const session = driver.session();
        try {

            const result = await session.run(
                `MATCH (p:BaseProfile {GiggrID: $giggrId})
                 RETURN p`,
                { giggrId }
            );
            console.log("giggrId from the find by gigr", giggrId);
            const record = result.records[0];
            if (record) {
                const node = record.get('p');
                return {
                    role: node.properties.role,
                    phone: node.properties.phone,
                    name: node.properties.name,
                    giggrId: node.properties.GiggrID,
                    dateOfBirth: node.properties.dateOfBirth,
                    email: node.properties.email,
                    entity: node.properties.entity,
                    metadata: node.properties.metadata,
                };
            } else {
                return null; // Node with the specified phone number not found
            }
        } finally {
            await session.close();
        }
    }
    async findByPhone(phone: string): Promise<BaseProfile | null> {
        const session = driver.session();
        try {
            const result = await session.run(
                `MATCH (p:BaseProfile {phone: $phone})
                 RETURN p`,
                { phone }
            );

            const record = result.records[0];
            if (record) {
                const node = record.get('p');
                return {
                    role: node.properties.role,
                    phone: node.properties.phone,
                    name: node.properties.name,
                    giggrId: node.properties.GiggrID,
                    dateOfBirth: node.properties.dateOfBirth,
                    email: node.properties.email,
                    entity: node.properties.entity,
                    metadata: node.properties.metadata,
                };
            } else {
                return null; // Node with the specified phone number not found
            }
        } finally {
            await session.close();
        }
    }
    async findByEmail(email: string): Promise<BaseProfile | null> {
        const session = driver.session();
        try {
            const result = await session.run(
                `MATCH (p:BaseProfile {email: $email})
                 RETURN p`,
                { email }
            );

            const record = result.records[0];
            if (record) {
                const node = record.get('p');
                return {
                    role: node.properties.role,
                    phone: node.properties.phone,
                    name: node.properties.name,
                    giggrId: node.properties.GiggrID,
                    dateOfBirth: node.properties.dateOfBirth,
                    email: node.properties.email,
                    entity: node.properties.entity,
                    metadata: node.properties.metadata,
                };
            } else {
                return null; // Node with the specified phone number not found
            }
        } finally {
            await session.close();
        }
    }
    async createBaseProfile(profile: BaseProfile): Promise<StatusCode> {
        const session = driver.session();
        try {
            const res = await session.run(
                `CREATE (e:BaseProfile {name: $name, email: $email, phone: $phone, dateOfBirth: $dateOfBirth,
                    role:$role, DeviceId:$metadata.deviceId
          ${profile.giggrId ? ", GiggrID: $giggrId" : ""} 
          })`,
                profile
            );

            return StatusCode.CREATED;
        } catch (e) {
            console.log("error happened in individual graph data entry:", e);
            return StatusCode.INTERNAL_ERROR;
        } finally {
            await session.close();
        }
    }
    async createOrganization(organization: OrganizationProfile): Promise<StatusCode> {
        const session = driver.session();
        try {
            const res = await session.run(
                `CREATE (e:${organization.entity} {GiggrID: $giggrId, extension: $extension, adminUUID:$adminUUID})`,
                organization
            );
            return StatusCode.CREATED;
        } catch (e) {
            console.log("error happened in individual graph data entry:", e);
            return StatusCode.INTERNAL_ERROR;
        }
        finally {
            await session.close();

        }
    }
}
