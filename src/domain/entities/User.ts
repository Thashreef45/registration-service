interface UserParams {
  accountId?: string;
  name: string;
  email?: string;
  phone: string;
  dateOfBirth: Date;
  OTP?: string;
}

/** Definition for an user entity of the platform. */
export class User {
  /** A 16-digit numeric identifier assigned to a user of the platform. */
  accountId?: string;
  /** The full legal name of the user. */
  name: string;
  /** The email address (personal, work, or academic) of the user. */
  email?: string;
  /** The phone number of the user. */
  phone: string;
  /** The date of birth of the user. */
  dateOfBirth: Date;
  /** The OTP of the user. */
  OTP?: string;

  constructor({ accountId, name, email, phone, dateOfBirth }: UserParams) {
    this.accountId = accountId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.OTP = "";
  }
}
