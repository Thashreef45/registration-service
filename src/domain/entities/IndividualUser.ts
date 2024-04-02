interface UserParams {
  UUID?: string | null;
  name: string;
  email?: string | null;
  phone: string;
  dateOfBirth: Date;
  OTP?: string;
  isRegistered?: boolean;
  emailIsVerified?: boolean;
  phoneIsVerified?: boolean;
  mailOTP: string;
}

/** Definition for an user entity of the platform. */
export class IndividualUser {
  /** A 16-digit numeric identifier assigned to a user of the platform. */
  UUID?: string | null;
  /** The full legal name of the user. */
  name?: string;
  /** The email address (personal, work, or academic) of the user. */
  email?: {
    id?: string | null;
    isVerified: boolean;
  };
  /** The phone number of the user. */
  phone?: {
    no?: string | null;
    isVerified: boolean;
  };
  /** The date of birth of the user. */
  dateOfBirth?: Date;
  /** The OTP of the user. */
  mailOTP?: string;
  /*  check if the user did the registration fully  */
  isRegistered: boolean;
  /*this is for the under 18 flow*/

  constructor({
    UUID,
    name,
    email,
    phone,
    dateOfBirth,
    isRegistered = false,
    emailIsVerified = false,
    phoneIsVerified = false,
    mailOTP = "",
  }: UserParams) {
    this.UUID = UUID;
    this.name = name;
    this.email = { id: email, isVerified: emailIsVerified };
    this.phone = { no: phone, isVerified: phoneIsVerified };
    this.dateOfBirth = dateOfBirth;
    this.mailOTP = mailOTP;
    this.isRegistered = isRegistered;
  }
}
