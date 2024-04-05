import { Router } from "express";
import * as Controller from "../controllers/IndividualSignupController.js";
import * as Schema from "../schemas/RegistrationSchemas.js";
import { requireSignupId } from "../middlewares/requireSignupId.js";
import validateSchema from "../middlewares/validateSchema.js";

const registrationRouter = Router(/* /signup */);

/** POST /signup/ */
registrationRouter.post("/", validateSchema(Schema.InitiateRegistrationSchema),Controller.InitiateRegistrationPost);
/** PATCH /signup */
registrationRouter.patch("/", requireSignupId,validateSchema(Schema.UpdateRegistrationSchema),Controller.UpdateRegistrationPatch);
/** GET /signup */
registrationRouter.get("/", requireSignupId,Controller.RetrieveRegistrationGet);

/** GET /signup/verify/:field */
registrationRouter.get("/verify/:field", requireSignupId,validateSchema(Schema.RequestOTPSchema),Controller.RequestOTPGet);
/** POST /signup/verify/:field */
registrationRouter.post("/verify/:field", requireSignupId,validateSchema(Schema.VerifyOTPSchema),Controller.VerifyOTPPost);

/** POST /signup/register */
registrationRouter.post("/register", requireSignupId,Controller.FinishRegistrationPost);

registrationRouter.post("/google", Controller.AuthUserViaGoogle);

registrationRouter.post("/linkedin", Controller.AuthUserViaLinkedin);

registrationRouter.post("/approval", requireSignupId,Controller.RequestApprovalPost);
registrationRouter.post("/approve", requireSignupId,Controller.AcceptApprovalPost);

export default registrationRouter;
