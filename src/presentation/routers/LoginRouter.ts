import { Router } from "express";
import * as Controller from "../controllers/IndividualSignupController.js";

const loginRouter = Router(/* /signup */);

loginRouter.post("/", Controller.LoginRequestPost);
loginRouter.post("/entry", Controller.LoginApprovalPost);
loginRouter.get("/me", Controller.GetUserProfile);

export default loginRouter;
