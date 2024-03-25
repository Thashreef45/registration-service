import { Router } from "express";
import { RegisterController } from "../controllers/RegisterController.js";

const registerRouter = Router();

registerRouter.post("/", RegisterController);

export default registerRouter;
