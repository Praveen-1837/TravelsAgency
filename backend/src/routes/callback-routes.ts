import { Router } from 'express';
import { submitCallback } from '../controllers/callback-controller';
import { callbackLimiter } from '../middleware/rate-limiter';

const router = Router();

// Rate limited public callback endpoint
router.post('/', callbackLimiter, submitCallback);

export default router;
