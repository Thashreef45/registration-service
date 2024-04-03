import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { IEmailService } from "../../interfaces/services/IEmailService.js";

export default class RequestEmailOTP implements IUseCase<Input, Output> {
    private readonly registrationRepository: IRegistrationRepository;
    private readonly emailService: IEmailService;

    constructor({ registrationRepository, emailService }: Dependencies) {
        this.registrationRepository = registrationRepository;
        this.emailService = emailService;
    }

    async execute({ signupId, email }: Input): Promise<Output> {

        const registration = await this.registrationRepository.findByUUID(signupId);
        if (!registration || registration.giggrId) {
            throw new AppError("No registration found", StatusCode.NOT_FOUND);
        }
    
        if (registration.email.isVerified) {
          throw new AppError("Email already verified.", StatusCode.CONFLICT);
        }
    
        // todo: make sure phone number is valid
        if (email && !registration.email.id) {
          const doesEmailExist = await this.registrationRepository.findByEmail(email);
          if (doesEmailExist) {
              throw new AppError("Credentials are invalid.", StatusCode.BAD_REQUEST);
          }
          registration.email.id = email;
        }
    
        if (!registration.email.id) {
          throw new AppError("No email id associated.", StatusCode.NOT_FOUND);
        }
    
        // todo: otpManager service
        registration.email.otp = this.GenerateOTP()

        const otpStatus = await this.emailService.sendEmail(
            registration.email.id,
            "Email Verification from Giggr",
            `<p>Your Giggr Code is: <b>${registration.email.otp}</b></p>`
        );

        if (otpStatus !== StatusCode.OK) {
          throw new AppError("An error occured with sending OTP.", otpStatus);
        }
        
        const updation = await this.registrationRepository.merge(registration);
        if (updation != StatusCode.OK) {
          throw new AppError("Could not update database.", StatusCode.INTERNAL_ERROR);
        }
    
        return { message: "OTP has been sent to email." };
      }

      private GenerateOTP = () => {
        return Math.random().toString().split("").slice(2,8).join("") 
      }
}

interface Dependencies {
    registrationRepository: IRegistrationRepository;
    emailService: IEmailService;
}

interface Input {
    signupId: string;
    email?: string;
}

interface Output {
    message: string;
}