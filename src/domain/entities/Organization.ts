interface OrganizationAttributes {
    uuid: string;
    adminUUID: string;
    name?: string;
    entity: "industry" | "institute";
    extension?: string;
    // members: [{ uuid: string; role: "administrator" }]
    documents: "awaiting" | "pending" | "approved";
    giggrId?: string;
}

export class Organization {
    /** An unique identifier for the organization. */    
    uuid: string;

    /** The transient registration id of the administrator. */
    adminUUID: string;

    /** The name of the organization. */    
    name?: string;
    
    /** The type of entity the organization comes under. */
    entity: "industry" | "institute";

    /** The domain extension of the organization. *eg:* `giggr.app` */
    extension?: string;

    /** Whether the required documents have been submitted for the organization. */
    documents: "awaiting" | "pending" | "approved";

    /** The 16-length alphanumeric unique code generated for the organization.  */
    giggrId?: string;

    constructor({ uuid, adminUUID, name, entity, extension, documents, giggrId }: OrganizationAttributes) {
        this.uuid = uuid;
        this.adminUUID = adminUUID;
        
        this.name = name;
        this.entity = entity;
        this.extension = extension;
        this.documents = documents;

        this.giggrId = giggrId;
    }
}