import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../services/supabase-service';
import * as callbackService from '../services/callback-service';
import * as packageService from '../services/package-service';
import { createPackageSchema, updatePackageSchema } from '../validators/package-validator';
import { createReviewSchema } from '../validators/review-validator';
import { AppError } from '../middleware/error-handler';

// 1. Admin Login (Supports demo credentials and Supabase Auth)
export async function loginAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'VALIDATION_ERROR');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check Supabase Auth if live project configured
    if (
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data?.session) {
        // Fetch role from admin_users
        const { data: adminUser } = await supabaseAdmin
          .from('admin_users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        res.json({
          token: data.session.access_token,
          user: {
            id: data.user.id,
            email: data.user.email,
            role: adminUser?.role || 'staff',
            name: data.user.user_metadata?.full_name || 'Aariva Operator',
          },
        });
        return;
      }
    }

    // Default / Demo Admin credentials
    if (cleanEmail === 'admin@aarivavoyages.com' && password === 'admin123') {
      res.json({
        token: 'demo-admin-token-aariva-secure-session',
        user: {
          id: 'admin-001',
          email: 'admin@aarivavoyages.com',
          role: 'admin',
          name: 'Aariva Head of Operations',
        },
      });
      return;
    }

    if (cleanEmail === 'staff@aarivavoyages.com' && password === 'staff123') {
      res.json({
        token: 'demo-staff-token-aariva-secure-session',
        user: {
          id: 'staff-001',
          email: 'staff@aarivavoyages.com',
          role: 'staff',
          name: 'Travel Marshal',
        },
      });
      return;
    }

    throw new AppError(
      'Invalid credentials. Check email and password.',
      401,
      'INVALID_CREDENTIALS'
    );
  } catch (err) {
    next(err);
  }
}

// 2. Admin Stats
export async function getAdminStats(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const callbacks = await callbackService.getAdminCallbacks();
    const packages = await packageService.getAllPackages({ limit: 50 });
    const reviews = await packageService.getAdminReviews();

    const total = callbacks.length;
    const newCount = callbacks.filter((c) => c.status === 'new').length;
    const contacted = callbacks.filter((c) => c.status === 'contacted').length;
    const converted = callbacks.filter((c) => c.status === 'converted').length;
    const closed = callbacks.filter((c) => c.status === 'closed').length;

    const conversionRate = total > 0 ? `${Math.round((converted / total) * 100)}%` : '0%';
    const pendingReviews = reviews.filter((r) => !r.is_approved).length;

    res.json({
      data: {
        total_inquiries: total,
        new_inquiries: newCount,
        contacted,
        converted,
        closed,
        conversion_rate: conversionRate,
        pending_reviews: pendingReviews,
        active_packages: packages.data.filter((p) => p.is_active).length,
        top_packages: [
          { title: 'Kashmir Couple Special', count: 18, conversion: '32%' },
          { title: 'Sikkim & Darjeeling Himalayan Escapade', count: 14, conversion: '28%' },
          { title: 'Andaman Island Bliss', count: 10, conversion: '24%' },
          { title: 'Lakshadweep Coral Paradise', count: 8, conversion: '20%' },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
}

// 3. Callback Requests Management
export async function listAdminCallbacks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const package_id = req.query.package_id as string | undefined;

    const callbacks = await callbackService.getAdminCallbacks({ status, search, package_id });
    res.json({ data: callbacks });
  } catch (err) {
    next(err);
  }
}

export async function getAdminCallbackDetail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const item = await callbackService.getCallbackById(id);
    if (!item) {
      throw new AppError('Callback request not found', 404, 'NOT_FOUND');
    }
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateAdminCallback(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { status, notes, assigned_to } = req.body;
    const updated = await callbackService.updateAdminCallback(id, { status, notes, assigned_to });
    if (!updated) {
      throw new AppError('Callback request not found', 404, 'NOT_FOUND');
    }
    res.json({ data: updated, message: 'Callback inquiry updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdminCallback(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const success = await callbackService.deleteAdminCallback(id);
    if (!success) {
      throw new AppError('Callback request not found', 404, 'NOT_FOUND');
    }
    res.json({ message: 'Callback request deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// 4. Packages Management
export async function listAdminPackages(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pkgs = await packageService.getAllPackages({ limit: 50 });
    res.json({ data: pkgs.data });
  } catch (err) {
    next(err);
  }
}

export async function createAdminPackage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = createPackageSchema.parse(req.body);
    const created = await packageService.createAdminPackage(validated);
    res.status(201).json({ data: created, message: 'Package created successfully' });
  } catch (err) {
    next(err);
  }
}

export async function updateAdminPackage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validated = updatePackageSchema.parse(req.body);
    const updated = await packageService.updateAdminPackage(id, validated);
    if (!updated) {
      throw new AppError('Package not found', 404, 'NOT_FOUND');
    }
    res.json({ data: updated, message: 'Package updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function togglePackageActive(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const updated = await packageService.toggleAdminPackageActive(id);
    if (!updated) {
      throw new AppError('Package not found', 404, 'NOT_FOUND');
    }
    res.json({
      data: updated,
      message: `Package ${updated.is_active ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdminPackage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const success = await packageService.deleteAdminPackage(id);
    if (!success) {
      throw new AppError('Package not found', 404, 'NOT_FOUND');
    }
    res.json({ message: 'Package deactivated/removed successfully' });
  } catch (err) {
    next(err);
  }
}

// 5. Reviews Moderation
export async function listAdminReviews(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filter = req.query.filter as 'all' | 'pending' | 'approved' | undefined;
    const reviews = await packageService.getAdminReviews(filter);
    res.json({ data: reviews });
  } catch (err) {
    next(err);
  }
}

export async function approveReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const approved = await packageService.approveAdminReview(id);
    if (!approved) {
      throw new AppError('Review not found', 404, 'NOT_FOUND');
    }
    res.json({ data: approved, message: 'Review approved and published to public site' });
  } catch (err) {
    next(err);
  }
}

export async function rejectReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const success = await packageService.rejectAdminReview(id);
    if (!success) {
      throw new AppError('Review not found', 404, 'NOT_FOUND');
    }
    res.json({ message: 'Review removed successfully' });
  } catch (err) {
    next(err);
  }
}

export async function createAdminReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { package_id, ...reviewFields } = req.body;
    if (!package_id) {
      throw new AppError('package_id is required', 400, 'VALIDATION_ERROR');
    }
    const validated = createReviewSchema.parse(reviewFields);
    const created = await packageService.createAdminReview({
      package_id,
      ...validated,
      is_approved: true, // Admin entered reviews are approved by default
    });
    res.status(201).json({ data: created, message: 'Review recorded and published' });
  } catch (err) {
    next(err);
  }
}
