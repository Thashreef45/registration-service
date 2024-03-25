import { Router } from 'express';
import RegisterController from '../controllers/registerController.js';

const registerRouter = Router();

registerRouter.post("/",RegisterController.registerUser);

export default registerRouter; 

