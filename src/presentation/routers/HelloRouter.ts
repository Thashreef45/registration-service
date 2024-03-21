import { HelloWorld } from '../controllers/HelloController.js';

import { Router } from 'express';

const router = Router();

router.get("/hello", HelloWorld);

export default router; 