import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../services/supabase-service';
import { AppError } from './error-handler';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: 'admin' | 'staff' | 'user';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Require valid Supabase User JWT for user-facing protected endpoints (e.g. callback submission, user bookings)
 */
export async function requireUserAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Missing or invalid Authorization header. Please log in.', 401, 'UNAUTHORIZED'));
    return;
  }

  const token = authHeader.split(' ')[1];

  if (token.startsWith('demo-user-token')) {
    req.user = {
      id: 'demo-user-001',
      email: 'user@example.com',
      role: 'user',
    };
    next();
    return;
  }

  try {
    if (
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      const {
        data: { user },
        error,
      } = await supabaseAdmin.auth.getUser(token);

      if (error || !user) {
        console.error('[Auth] Supabase auth error in requireUserAuth:', error);
        next(new AppError('Invalid or expired authentication token. Please log in again.', 401, 'UNAUTHORIZED'));
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: 'user',
      };

      next();
      return;
    }

    // Local dev fallback if token is provided
    req.user = {
      id: 'user-001',
      email: 'user@example.com',
      role: 'user',
    };
    next();
  } catch (err) {
    next(new AppError('Failed to authenticate token', 401, 'UNAUTHORIZED', err));
  }
}

/**
 * Require Admin/Staff role JWT for back-office operations
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Missing or invalid Authorization header', 401, 'UNAUTHORIZED'));
    return;
  }

  const token = authHeader.split(' ')[1];

  if (token.startsWith('demo-admin-token')) {
    req.user = {
      id: 'admin-001',
      email: 'admin@aarivavoyages.com',
      role: 'admin',
    };
    next();
    return;
  }

  if (token.startsWith('demo-staff-token')) {
    req.user = {
      id: 'staff-001',
      email: 'staff@aarivavoyages.com',
      role: 'staff',
    };
    next();
    return;
  }

  try {
    if (
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      const {
        data: { user },
        error,
      } = await supabaseAdmin.auth.getUser(token);

      if (error || !user) {
        next(new AppError('Invalid or expired authentication token', 401, 'UNAUTHORIZED'));
        return;
      }

      const { data: adminData, error: adminError } = await supabaseAdmin
        .from('admin_users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (adminError || !adminData) {
        next(new AppError('Unauthorized: Admin access required', 403, 'FORBIDDEN'));
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: adminData.role as 'admin' | 'staff',
      };

      next();
      return;
    }

    req.user = {
      id: 'admin-001',
      email: 'admin@aarivavoyages.com',
      role: 'admin',
    };
    next();
  } catch (err) {
    next(new AppError('Failed to authenticate token', 401, 'UNAUTHORIZED', err));
  }
}

export function requireAdminRole(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.role !== 'admin') {
    next(new AppError('Action restricted to full administrators', 403, 'FORBIDDEN'));
    return;
  }
  next();
}
