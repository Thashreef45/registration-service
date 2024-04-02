import { Router } from "express";
import * as Controller from "../controllers/RegistrationController.js";

const registrationRouter = Router();

// registrationRouter.post("/signup", StartSignup);
// registrationRouter.post("/signup/phone", ConfirmPhone);
// registrationRouter.post("/signup/phone/verify", VerifyPhone);
// registrationRouter.post("/signup/chat", ChatAssistant);
// registrationRouter.get("/signup/chat", ChatAssistantGet);
// registrationRouter.post("/signup/email", ConfirmEmail);


//veruthe--test
registrationRouter.get("/test",(req:any,res:any) => res.send({"":"test,api"}))

///////////////////////////////////////////////////


//Partial updates name?, email?, phone?..... 
registrationRouter.patch("/",Controller.UpdateUserDataPatch)

///verify/:field -- instead of field, medium would be better ---just suggestion
registrationRouter.get("/verify/:field",Controller.ReqOTP)


//otp verification
registrationRouter.post("/verify/:field",Controller.VerifyOtp)


//registered , return 16 digit giggrId
registrationRouter.post("/register",Controller.Registered)






export default registrationRouter;
