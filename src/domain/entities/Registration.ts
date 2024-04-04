interface RegistrationParams {
    /* generated data */
    uuid: string;

    /* metadata */
    deviceId: string; // Creep.js like Fingerprint
    networkId: string; // IP
    locationId: string; // Country + State
    platformId?: string; // OS + Browser
    metaChecksum?: string; // Checksum

    /* entered data */
    entity: "individual" | "industry" | "institute";
    role: "administrator" | "user";
    name?: string;
    email?: string;
    emailVerified?: boolean;
    phone?: string;
    phoneVerifed?: boolean;
    dateOfBirth?: Date;

    giggrId?: string;

    // needsApproval?: boolean;
    // needsApprovalFrom?: "guardian" | "administrator";
    // requestedApproval?: boolean;
    // isApproved: boolean;
}

/** Definition for an user entity of the platform. */
export class Registration {
    /** A unique identifier for transient users. */
    uuid: string;

    /** The entity signing up for the platform. */
    entity: "individual" | "industry" | "institute";
    /** The role of the entity for their account. */
    role: "administrator" | "user";

    /** The metadata collected from the client. */
    metadata: {
        deviceId: string; // Creep.js like Fingerprint
        networkId: string; // IP
        locationId: string; // Country + State
        platformId?: string; // OS + Browser
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

    /**  Only when the registration process is complete.  */
    giggrId?: string;

    // approval: {
    //     isRequired: boolean;
    //     isRequested?: boolean;
    //     isFrom?: "guardian" | "administrator";
    //     isApproved: boolean;
    // }

    constructor({ uuid, entity, role, deviceId, networkId, locationId, platformId, name, email, phone, dateOfBirth, emailVerified, phoneVerifed, giggrId }: RegistrationParams) {

        this.uuid = uuid;
        this.entity = entity;
        this.role = role;
        this.metadata = { deviceId, networkId, locationId, platformId };

        this.name = name;
        this.email = { id: email, isVerified: emailVerified || false };
        this.phone = { number: phone, isVerified: phoneVerifed || false };
        this.dateOfBirth = dateOfBirth;

        this.giggrId = giggrId;

        // this.approval = {
        //     isRequired: 
        //     isApproved: isApproved ?? false 
        // };
    }
}