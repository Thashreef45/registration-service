import { Router } from "express";
import { ChatAssistant, ChatAssistantGet, ConfirmEmail, ConfirmPhone, RegisterUser, StartSignup, VerifyPhone } from "../controllers/RegistrationController.js";

const registrationRouter = Router();

registrationRouter.post("/signup", StartSignup);
registrationRouter.post("/signup/phone", ConfirmPhone);
registrationRouter.post("/signup/phone/verify", VerifyPhone);
registrationRouter.post("/signup/chat", ChatAssistant);
registrationRouter.get("/signup/chat", ChatAssistantGet);
registrationRouter.post("/signup/email", ConfirmEmail);

export default registrationRouter;
