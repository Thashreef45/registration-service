interface RegistrationParams {
    uuid: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    otpRequested: boolean;
    otpVerified: boolean;
}

/** Definition for a registration entity of the platform. */
export class Registration {
    /** A unique identifier assigned to a registration. */
    uuid: string;
    /** The full legal name of the registrant. */
    name: string;
    /** The email address (personal, work, or academic) of the registrant. */
    email: string;
    /** The phone number of the registrant. */
    phone: string;
    /** The date of birth of the registrant. */
    dateOfBirth: Date;
    /** Indicates whether an OTP (One-Time Password) has been requested for the registration. */
    otpRequested: boolean;
    /** Indicates whether an OTP (One-Time Password) has been successfully verified for the registration. */
    otpVerified: boolean;

    constructor({ uuid, name, email, phone, dateOfBirth, otpRequested, otpVerified }: RegistrationParams) {
        this.uuid = uuid;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.otpRequested = otpRequested;
        this.otpVerified = otpVerified;
    }
}