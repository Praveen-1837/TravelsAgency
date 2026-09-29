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
    const result = await callbackService.createCallbackRequest(validatedInput);
    res.status(201).json({
      data: result,
      message: 'Callback request registered successfully',
    });
  } catch (err) {
    next(err);
  }
}
