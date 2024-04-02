import { Router } from "express";
import * as Controller from "../controllers/IndividualSignupController.js";
import { requireSignupId } from "../middlewares/requireSignupId.js";

const registrationRouter = Router(/* /signup/individual */);

/** POST /signup/individual */
registrationRouter.post("/", Controller.InitiateRegistrationPost);
/** PATCH /signup/individual */
registrationRouter.patch("/", requireSignupId, Controller.UpdateRegistrationPatch);
/** GET /signup/individual */
registrationRouter.get("/", requireSignupId, Controller.RetrieveRegistrationGet);

/** GET /signup/individual/verify/:field */
registrationRouter.get("/verify/:field", requireSignupId, Controller.RequestOTPGet);
/** POST /signup/individual/verify/:field */
registrationRouter.post("/verify/:field",Controller.VerifyOTPPost);

/** POST /signup/individual/register */
registrationRouter.post("/register",Controller.FinishRegistrationPost);

export default registrationRouter;