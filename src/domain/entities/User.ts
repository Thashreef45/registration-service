
interface UserParams {
    lifeId: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
}

/** Definition for an user entity of the platform. */
export class User {
    /** A 16-digit numeric identifier assigned to a user of the platform. */
    lifeId: string;
    /** The full legal name of the user. */
    name: string;
    /** The email address (personal, work, or academic) of the user. */
    email: string;
    /** The phone number of the user. */
    phone: string;
    /** The date of birth of the user. */
    dateOfBirth: Date;

    constructor({ lifeId, name, email, phone, dateOfBirth }: UserParams) {
        this.lifeId = lifeId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
    }
}