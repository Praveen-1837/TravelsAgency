import { Router } from 'express';
import {
  listPackages,
  getPackage,
  listPackageReviews,
  submitReview,
} from '../controllers/package-controller';

const router = Router();

router.get('/', listPackages);
router.get('/:slug', getPackage);
router.get('/:slug/reviews', listPackageReviews);
router.post('/:slug/reviews', submitReview);

export default router;
