import { Request, Response, NextFunction } from 'express';
import { packageQuerySchema } from '../validators/package-validator';
import { createReviewSchema } from '../validators/review-validator';
import * as packageService from '../services/package-service';

export async function listPackages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filters = packageQuerySchema.parse(req.query);
    const result = await packageService.getAllPackages(filters);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getPackage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const pkg = await packageService.getPackageBySlug(slug);
    res.json({ data: pkg });
  } catch (err) {
    next(err);
  }
}

export async function listPackageReviews(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { slug } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await packageService.getPackageReviews(slug, { page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function submitReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const validatedInput = createReviewSchema.parse(req.body);
    const result = await packageService.submitPackageReview(slug, validatedInput);
    res.status(201).json({
      data: result,
      message: 'Review submitted successfully. It will be published after moderation.',
    });
  } catch (err) {
    next(err);
  }
}
