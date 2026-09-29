import { Router } from 'express';
import { requireAuth, requireAdminRole } from '../middleware/auth-middleware';
import {
  loginAdmin,
  getAdminStats,
  listAdminCallbacks,
  getAdminCallbackDetail,
  updateAdminCallback,
  deleteAdminCallback,
  listAdminPackages,
  createAdminPackage,
  updateAdminPackage,
  togglePackageActive,
  deleteAdminPackage,
  listAdminReviews,
  approveReview,
  rejectReview,
  createAdminReview,
} from '../controllers/admin-controller';

const router = Router();

// 1. Authentication (Public login endpoint)
router.post('/login', loginAdmin);

// All subsequent admin routes require valid authentication
router.use(requireAuth);

// 2. Dashboard Analytics & Stats
router.get('/stats', getAdminStats);

// 3. Callback Requests Management
router.get('/callbacks', listAdminCallbacks);
router.get('/callbacks/:id', getAdminCallbackDetail);
router.patch('/callbacks/:id', updateAdminCallback);
router.delete('/callbacks/:id', requireAdminRole, deleteAdminCallback);

// 4. Packages Management
router.get('/packages', listAdminPackages);
router.post('/packages', createAdminPackage);
router.put('/packages/:id', updateAdminPackage);
router.patch('/packages/:id/toggle', togglePackageActive);
router.delete('/packages/:id', requireAdminRole, deleteAdminPackage);

// 5. Reviews Moderation
router.get('/reviews', listAdminReviews);
router.post('/reviews', createAdminReview);
router.patch('/reviews/:id/approve', approveReview);
router.delete('/reviews/:id', requireAdminRole, rejectReview);

export default router;
