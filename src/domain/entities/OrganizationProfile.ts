interface OrganizationProfileParams {
    entity: "industry" | "institute";
    organizationName: string;
    extension: string;
    giggrId: string;
}

/** Definition for an user entity of the platform. */
export class OrganizationProfile {
    organizationName: string;
    extension: string;
    /** The entity. */
    entity: "industry" | "institute";

    /** The unique, 16 length alphanumeric code assigned to an organization. */
    giggrId: string;

    constructor({ entity, organizationName, extension, giggrId }: OrganizationProfileParams) {

        this.entity = entity;
        this.organizationName = organizationName;
        this.extension = extension;
        this.giggrId = giggrId;
    }
}