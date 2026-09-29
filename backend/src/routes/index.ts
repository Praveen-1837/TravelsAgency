import { Router } from 'express';
import packageRoutes from './package-routes';
import callbackRoutes from './callback-routes';
import adminRoutes from './admin-routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Aariva Voyages Backend API',
  });
});

// Mount modules
router.use('/packages', packageRoutes);
router.use('/callbacks', callbackRoutes);
router.use('/admin', adminRoutes);

export default router;
