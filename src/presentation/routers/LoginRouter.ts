import { Router } from "express";
import * as Controller from "../controllers/IndividualSignupController.js";

const loginRouter = Router(/* /signup */);

loginRouter.post("/", Controller.SigninRequestPost);
loginRouter.post("/entry", Controller.SigninApprovalPost);
loginRouter.get("/me", Controller.GetUserProfile);

export default loginRouter;
