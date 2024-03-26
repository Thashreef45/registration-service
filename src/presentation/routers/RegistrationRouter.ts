import { Router } from "express";
import { RegisterUser } from "../controllers/RegistrationController.js";

const registrationRouter = Router();

registrationRouter.post("/register", RegisterUser);

export default registrationRouter;
