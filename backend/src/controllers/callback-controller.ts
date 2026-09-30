import { Request, Response, NextFunction } from 'express';
import { callbackRequestSchema } from '../validators/callback-validator';
import * as callbackService from '../services/callback-service';

export async function submitCallback(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedInput = callbackRequestSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: { message: 'Authentication required' } });
      return;
    }

    const result = await callbackService.createCallbackRequest(validatedInput, userId);
    res.status(201).json({
      data: result,
      message: 'Callback request registered successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserCallbacks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: { message: 'Authentication required' } });
      return;
    }

    const callbacks = await callbackService.getUserCallbacks(userId);
    res.json({
      data: callbacks,
    });
  } catch (err) {
    next(err);
  }
}
