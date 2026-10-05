import { Router } from 'express';
import { submitCallback, getUserCallbacks } from '../controllers/callback-controller';
import { callbackLimiter } from '../middleware/rate-limiter';
import { requireUserAuth } from '../middleware/auth-middleware';

const router = Router();

// Require user authentication for callback submissions & user callback list
router.post(
  '/',
  (req, res, next) => {
    console.log('[Auth] Authorization header in /api/callbacks:', req.headers.authorization);
    next();
  },
  requireUserAuth,
  callbackLimiter,
  submitCallback
);
router.get('/me', requireUserAuth, getUserCallbacks);

export default router;
