interface RegistrationParams {
    /* generated data */
    uuid: string;

    /* metadata */
    deviceId: string; // Creep.js like Fingerprint
    networkId: string; // IP
    locationId: string; // Country + State
    platformId: string; // OS + Browser
    metaChecksum?: string; // Checksum

    /* entered data */
    entity: "individual" | "industry" | "institute";
    name?: string;
    email?: string;
    emailVerified?: boolean;
    phone?: string;
    phoneVerifed?: boolean;
    dateOfBirth?: Date;
}

/** Definition for an user entity of the platform. */
export class Registration {
    /** A 16-digit numeric identifier assigned to a user of the platform. */
    uuid: string;

    /** The entity signing up for the platform. */
    entity: "individual" | "industry" | "institute";

    /** The metadata collected from the client. */
    metadata: {
        deviceId: string; // Creep.js like Fingerprint
        networkId: string; // IP
        locationId: string; // Country + State
        platformId: string; // OS + Browser
        metaChecksum?: string; // Checksum
    };

    /** The full legal name of the user. */
    name?: string;
    /** The email address (personal, work, or academic) of the user. */
    email: {
        id?: string;
        otp?: string;
        isVerified: boolean;
    };
    /** The phone number of the user. */
    phone: {
        number?: string;
        otp?: string;
        isVerified: boolean;
    };
    /** The date of birth of the user. */
    dateOfBirth?: Date;

    /**  Whether the registration process is complete or not.  */
    isCompleted: boolean;

    constructor({ uuid, entity, deviceId, networkId, locationId, platformId, name, email, phone, dateOfBirth, emailVerified, phoneVerifed }: UserParams) {

        this.uuid = uuid;
        this.entity = entity;
        this.metadata = { deviceId, networkId, locationId, platformId };

        this.name = name;
        this.email = { id: email, isVerified: emailVerified || false };
        this.phone = { number: phone, isVerified: phoneVerifed || false };
        this.dateOfBirth = dateOfBirth;

        this.isCompleted = false;
    }
}