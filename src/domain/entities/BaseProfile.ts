interface BaseProfileParams {
    /* metadata */
    deviceId: string; // Creep.js like Fingerprint
    networkId: string; // IP
    locationId: string; // Country + State

    /* entered data */
    entity: "individual" | "industry" | "institute";
    role: "administrator" | "user";
    name: string;
    email: string;
    phone: string;
    dateOfBirth: Date;

    giggrId?: string;
}

/** Definition for an user entity of the platform. */
export class BaseProfile {
    /** The entity. */
    entity: "individual" | "industry" | "institute";
    /** The role of the entity for their account. */
    role: "administrator" | "user";

    /** The metadata collected from the client. */
    metadata: {
        deviceId: string; // Creep.js like Fingerprint
        networkId: string; // IP
        locationId: string; // Country + State
    };

    /** The full legal name of the user. */
    name: string;
    /** The email address (personal, work, or academic) of the user. */
    email: string;
    /** The phone number of the user. */
    phone: string;
    /** The date of birth of the user. */
    dateOfBirth: Date;

    /** The unique, 16 length alphanumeric code assigned to a user. */
    giggrId?: string;

    constructor({ entity, role, deviceId, networkId, locationId, name, email, phone, dateOfBirth, giggrId }: BaseProfileParams) {

        this.entity = entity;
        this.role = role;
        this.metadata = { deviceId, networkId, locationId };

        this.email = email;
        this.phone = phone;

        this.name = name;
        this.dateOfBirth = dateOfBirth;

        this.giggrId = giggrId;
    }
}