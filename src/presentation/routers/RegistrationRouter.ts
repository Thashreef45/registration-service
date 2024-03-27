import { Router } from "express";
import { RegisterUser } from "../controllers/RegistrationController.js";
import { OtpGenerator } from "../controllers/OtpController.js";

const registrationRouter = Router();

registrationRouter.post("/register", RegisterUser);
registrationRouter.post("/getotp", OtpGenerator);

export default registrationRouter;
