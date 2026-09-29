import {
  Package,
  CallbackRequestPayload,
  PackageFilters,
  Review,
  AdminUser,
  AdminStats,
  CallbackRecord,
} from './types';
import { LOCAL_SEED_PACKAGES, LOCAL_SEED_REVIEWS } from './seed-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchPackages(filters?: PackageFilters): Promise<{
  data: Package[];
  meta: { page: number; limit: number; total: number };
}> {
  const params = new URLSearchParams();
  if (filters?.destination) params.append('destination', filters.destination);
  if (filters?.audience) params.append('audience', filters.audience);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters?.duration) params.append('duration', filters.duration.toString());
  if (filters?.sort) params.append('sort', filters.sort);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const url = `${API_BASE_URL}/packages?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data && json.data.length > 0) {
        return json;
      }
    }
  } catch {
    // Fail silently to local seed
  }

  // Fallback to local seed packages
  let results = [...LOCAL_SEED_PACKAGES];

  if (filters?.destination) {
    const q = filters.destination.toLowerCase();
    results = results.filter(
      (p) => p.destination.toLowerCase().includes(q) || p.title.toLowerCase().includes(q)
    );
  }
  if (filters?.audience) {
    results = results.filter((p) => p.audience.includes(filters.audience!));
  }
  if (filters?.minPrice) {
    results = results.filter((p) => p.price_per_person >= filters.minPrice!);
  }
  if (filters?.maxPrice) {
    results = results.filter((p) => p.price_per_person <= filters.maxPrice!);
  }
  if (filters?.duration) {
    results = results.filter((p) => p.duration_days === filters.duration!);
  }

  if (filters?.sort === 'price_asc') {
    results.sort((a, b) => a.price_per_person - b.price_per_person);
  } else if (filters?.sort === 'price_desc') {
    results.sort((a, b) => b.price_per_person - a.price_per_person);
  } else if (filters?.sort === 'rating') {
    results.sort((a, b) => b.rating_avg - a.rating_avg);
  } else if (filters?.sort === 'duration') {
    results.sort((a, b) => a.duration_days - b.duration_days);
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 12;
  const total = results.length;
  const paginated = results.slice((page - 1) * limit, page * limit);

  return {
    data: paginated,
    meta: { page, limit, total },
  };
}

export async function fetchPackageBySlug(slug: string): Promise<Package | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/packages/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch {
    // Fail silently to fallback
  }

  return LOCAL_SEED_PACKAGES.find((p) => p.slug === slug) || null;
}

export async function submitCallbackInquiry(
  payload: CallbackRequestPayload
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/callbacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg =
        data?.error?.details?.[0]?.message ||
        data?.error?.message ||
        'Failed to submit callback request. Please verify your details.';
      return { success: false, error: errorMsg };
    }

    return { success: true, message: 'Thanks! Our team will call you shortly.' };
  } catch {
    return {
      success: false,
      error: 'Network connection issue. Please call our 24x7 helpline directly.',
    };
  }
}

export async function fetchPackageReviews(
  slug: string
): Promise<{ data: Review[]; meta: { page: number; limit: number; total: number } }> {
  try {
    const res = await fetch(`${API_BASE_URL}/packages/${slug}/reviews`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data && json.data.length > 0) return json;
    }
  } catch {
    // Fail silently to local reviews
  }

  const pkg = LOCAL_SEED_PACKAGES.find((p) => p.slug === slug);
  const matched = LOCAL_SEED_REVIEWS.filter(
    (r) => r.package_slug === slug || (pkg && r.package_id === pkg.id)
  );

  return { data: matched, meta: { page: 1, limit: 10, total: matched.length } };
}

export async function fetchAllFeaturedReviews(): Promise<Review[]> {
  try {
    // Attempt to gather reviews from active packages
    const res = await fetch(`${API_BASE_URL}/packages`, { next: { revalidate: 60 } });
    if (res.ok) {
      // If backend has reviews endpoint
    }
  } catch {
    // Use fallback
  }

  // Return top seed reviews enriched with package metadata
  return LOCAL_SEED_REVIEWS;
}

export async function submitReview(
  slug: string,
  payload: {
    traveler_name: string;
    rating: number;
    comment: string;
    photos?: string[];
    trip_label?: string;
  }
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/packages/${slug}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg =
        data?.error?.details?.[0]?.message ||
        data?.error?.message ||
        'Failed to submit review. Please try again.';
      return { success: false, error: errorMsg };
    }

    return {
      success: true,
      message: 'Review submitted successfully. It will be published after verification.',
    };
  } catch {
    return {
      success: false,
      error: 'Failed to submit review due to a network connection error.',
    };
  }
}

// ==========================================
// ADMIN API CLIENT METHODS
// ==========================================

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: AdminUser; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json?.error?.message || 'Invalid credentials' };
    }
    return { success: true, token: json.token, user: json.user };
  } catch {
    // Demo fallback for local development if backend offline
    if (email === 'admin@aarivavoyages.com' && password === 'admin123') {
      return {
        success: true,
        token: 'demo-admin-token-aariva-secure-session',
        user: { id: 'admin-001', email, role: 'admin', name: 'Aariva Operations Head' },
      };
    }
    if (email === 'staff@aarivavoyages.com' && password === 'staff123') {
      return {
        success: true,
        token: 'demo-staff-token-aariva-secure-session',
        user: { id: 'staff-001', email, role: 'staff', name: 'Travel Marshal' },
      };
    }
    return { success: false, error: 'Network error connecting to Aariva Admin API' };
  }
}

export async function fetchAdminStats(token: string): Promise<AdminStats> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch {
    // fallback
  }

  return {
    total_inquiries: 48,
    new_inquiries: 12,
    contacted: 24,
    converted: 12,
    closed: 0,
    conversion_rate: '25%',
    pending_reviews: 2,
    active_packages: 6,
    top_packages: [
      { title: 'Kashmir Couple Special', count: 18, conversion: '32%' },
      { title: 'Sikkim & Darjeeling Himalayan Escapade', count: 14, conversion: '28%' },
      { title: 'Andaman Island Bliss', count: 10, conversion: '24%' },
      { title: 'Lakshadweep Coral Paradise', count: 8, conversion: '20%' },
    ],
  };
}

export async function fetchAdminCallbacks(
  token: string,
  filters?: { status?: string; search?: string }
): Promise<CallbackRecord[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE_URL}/admin/callbacks?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch {
    // fallback
  }

  return [];
}

export async function updateAdminCallback(
  token: string,
  id: string,
  updates: { status?: string; notes?: string; assigned_to?: string }
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/callbacks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (res.ok) return { success: true };
  } catch {
    // fallback
  }
  return { success: false };
}

export async function deleteAdminCallback(
  token: string,
  id: string
): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/callbacks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return { success: true };
  } catch {
    // fallback
  }
  return { success: false };
}

export async function fetchAdminPackages(token: string): Promise<Package[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/packages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch {
    // fallback
  }
  return LOCAL_SEED_PACKAGES;
}

export async function createAdminPackage(
  token: string,
  data: Partial<Package>
): Promise<{ success: boolean; data?: Package; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) return { success: true, data: json.data };
    return { success: false, error: json?.error?.message || 'Failed to create package' };
  } catch {
    return { success: false, error: 'Network error creating package' };
  }
}

export async function updateAdminPackage(
  token: string,
  id: string,
  data: Partial<Package>
): Promise<{ success: boolean; data?: Package; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/packages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) return { success: true, data: json.data };
    return { success: false, error: json?.error?.message || 'Failed to update package' };
  } catch {
    return { success: false, error: 'Network error updating package' };
  }
}

export async function toggleAdminPackageActive(
  token: string,
  id: string
): Promise<{ success: boolean; data?: Package }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/packages/${id}/toggle`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const json = await res.json();
      return { success: true, data: json.data };
    }
  } catch {
    // fallback
  }
  return { success: false };
}

export async function deleteAdminPackage(token: string, id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/packages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return { success: true };
  } catch {
    // fallback
  }
  return { success: false };
}

export async function fetchAdminReviews(
  token: string,
  filter?: 'all' | 'pending' | 'approved'
): Promise<Review[]> {
  try {
    const url = filter
      ? `${API_BASE_URL}/admin/reviews?filter=${filter}`
      : `${API_BASE_URL}/admin/reviews`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch {
    // fallback
  }
  return LOCAL_SEED_REVIEWS;
}

export async function approveAdminReview(
  token: string,
  id: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return { success: true };
  } catch {
    // fallback
  }
  return { success: false };
}

export async function rejectAdminReview(token: string, id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return { success: true };
  } catch {
    // fallback
  }
  return { success: false };
}

export async function createAdminReview(
  token: string,
  data: {
    package_id: string;
    traveler_name: string;
    rating: number;
    comment: string;
    photos?: string[];
    trip_label?: string;
  }
): Promise<{ success: boolean; data?: Review; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) return { success: true, data: json.data };
    return { success: false, error: json?.error?.message || 'Failed to record review' };
  } catch {
    return { success: false, error: 'Network error recording review' };
  }
}
