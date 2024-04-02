interface UserParams {
  
  accountId?: string | null;
  name: string;
  email?: string | null;
  phone: string;
  dateOfBirth: Date;
  OTP?: string;
  isRegistered?: boolean;
}

/** Definition for an user entity of the platform. */
export class User {
  /** A 16-digit numeric identifier assigned to a user of the platform. */
  accountId?: string | null;
  /** The full legal name of the user. */
  name: string;
  /** The email address (personal, work, or academic) of the user. */
  email?: string | null;
  /** The phone number of the user. */
  phone: string;
  /** The date of birth of the user. */
  dateOfBirth: Date;
  /** The OTP of the user. */
  OTP?: string;
  /*  check if the user did the registration fully  */
  isRegistered: boolean;

  constructor({
    accountId,
    name,
    email,
    phone,
    dateOfBirth,
    isRegistered = false,
  }: UserParams) {
    this.accountId = accountId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.OTP = "";
    this.isRegistered = isRegistered;
  }
}
