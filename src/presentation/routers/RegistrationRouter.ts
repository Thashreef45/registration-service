import { Router } from "express";
import { RegisterUser } from "../controllers/RegistrationController.js";
import { OtpGenerator } from "../controllers/OtpController.js";
import OTPCreatorService from "../../use-cases/interactors/OTPCreator.js";
import { ConfirmOTP } from "../controllers/ConfirmOTPController.js";

const registrationRouter = Router();

registrationRouter.post("/register", RegisterUser);
registrationRouter.post("/getotp", OtpGenerator);
registrationRouter.post("/confirmotp", ConfirmOTP);

export default registrationRouter;
