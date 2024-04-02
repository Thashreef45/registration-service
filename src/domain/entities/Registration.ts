interface RegistrationParams {
    uuid?: string | null;
    name?: string;
    email?: string | null;
    phone?: string | null;
    dateOfBirth?: Date | null ;
    otpRequested?: boolean;
    otpVerified?: boolean;
    emailVerified?: boolean;
}

/** Definition for a registration entity of the platform. */
export class Registration {
    /** A unique identifier assigned to a registration. */
    uuid: string | null;
    /** The full legal name of the registrant. */
    name?: string | null;
    /** The email address (personal, work, or academic) of the registrant. */
    email?: string | null;
    /** The phone number of the registrant. */
    phone?: string | null;
    /** The date of birth of the registrant. */
    dateOfBirth: Date | null;
    /** Indicates whether an OTP (One-Time Password) has been requested for the registration. */
    otpRequested: boolean;
    /** Indicates whether an OTP (One-Time Password) has been successfully verified for the registration. */
    otpVerified: boolean;
    /** Indicates whether email is verified. */
    emailVerified: boolean;

    constructor({ uuid, name, email, phone, dateOfBirth, otpRequested, otpVerified, emailVerified }: RegistrationParams) {
        this.uuid = uuid ?? null;
        this.name = name ?? null;
        this.email = email ?? null;
        this.phone = phone ?? null;
        this.dateOfBirth = dateOfBirth ?? null;
        this.otpRequested = otpRequested ?? false;
        this.otpVerified = otpVerified ?? false;
        this.emailVerified = emailVerified ?? false;
    }
}
