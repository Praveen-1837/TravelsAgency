import crypto from 'crypto';
import { supabaseAdmin } from './supabase-service';
import { sendCallbackNotifications } from './email-service';
import { CallbackRequestInput } from '../validators/callback-validator';
import { SEED_PACKAGES } from './package-service';
import { AppError } from '../middleware/error-handler';

export interface CallbackRecord {
  id: string;
  user_id?: string | null;
  package_id?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  travel_from?: string | null;
  travel_to?: string | null;
  group_size?: number;
  special_requests?: string | null;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  assigned_to?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

// In-memory store for user rate limiting and local dev fallback
const memoryCallbacks: CallbackRecord[] = [
  {
    id: 'cb-001',
    user_id: 'user-001',
    package_id: '55555555-5555-5555-5555-555555555555',
    name: 'Riya & Kunal Sharma',
    phone: '9876543210',
    email: 'riya.sharma@example.com',
    travel_from: '2026-11-10',
    travel_to: '2026-11-16',
    group_size: 2,
    special_requests: 'Honeymoon floral decoration in houseboat & private Shikara session',
    status: 'new',
    assigned_to: 'Aariva Operations',
    notes: 'Inquired from Delhi. Prefers evening call.',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cb-002',
    user_id: 'user-001',
    package_id: '11111111-1111-1111-1111-111111111111',
    name: 'Praveen Varma',
    phone: '9820198201',
    email: 'praveen.varma@example.com',
    travel_from: '2026-12-05',
    travel_to: '2026-12-12',
    group_size: 4,
    special_requests: 'Family trip with senior citizens. Need ground floor hotel rooms.',
    status: 'contacted',
    assigned_to: 'Sunil Rao',
    notes: 'Called customer on WhatsApp, shared custom 6N/7D PDF itinerary. Follow-up tomorrow.',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
];

const phoneSubmissions = new Map<string, number[]>();
const userDailySubmissions = new Map<string, { count: number; day: string }>();

export async function getUserCallbacks(userId: string): Promise<CallbackRecord[]> {
  try {
    if (
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      const { data, error } = await supabaseAdmin
        .from('callback_requests')
        .select('*, packages(title, destination)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as CallbackRecord[];
      }
    }
  } catch (err) {
    console.warn('[CallbackService] getUserCallbacks fallback to memory:', err);
  }

  return memoryCallbacks.filter((c) => c.user_id === userId || !c.user_id);
}

export async function getAdminCallbacks(filters?: {
  status?: string;
  package_id?: string;
  search?: string;
}): Promise<CallbackRecord[]> {
  try {
    if (
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      let query = supabaseAdmin
        .from('callback_requests')
        .select('*, packages(title, destination)')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.package_id) {
        query = query.eq('package_id', filters.package_id);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as CallbackRecord[];
      }
    }
  } catch (err) {
    console.warn('[CallbackService] getAdminCallbacks fallback to memory:', err);
  }

  let list = [...memoryCallbacks];
  if (filters?.status && filters.status !== 'all') {
    list = list.filter((c) => c.status === filters.status);
  }
  if (filters?.package_id) {
    list = list.filter((c) => c.package_id === filters.package_id);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }

  return list;
}

export async function getCallbackById(id: string): Promise<CallbackRecord | null> {
  try {
    if (
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      const { data, error } = await supabaseAdmin
        .from('callback_requests')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return data as CallbackRecord;
    }
  } catch {
    // fallback
  }

  return memoryCallbacks.find((c) => c.id === id) || null;
}

export async function updateAdminCallback(
  id: string,
  updates: {
    status?: 'new' | 'contacted' | 'converted' | 'closed';
    notes?: string;
    assigned_to?: string;
  }
): Promise<CallbackRecord | null> {
  const now = new Date().toISOString();
  try {
    if (
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      const { data, error } = await supabaseAdmin
        .from('callback_requests')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) return data as CallbackRecord;
    }
  } catch {
    // fallback
  }

  const record = memoryCallbacks.find((c) => c.id === id);
  if (!record) return null;

  if (updates.status !== undefined) record.status = updates.status;
  if (updates.notes !== undefined) record.notes = updates.notes;
  if (updates.assigned_to !== undefined) record.assigned_to = updates.assigned_to;
  record.updated_at = now;

  return record;
}

export async function deleteAdminCallback(id: string): Promise<boolean> {
  try {
    if (
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      const { error } = await supabaseAdmin.from('callback_requests').delete().eq('id', id);
      if (!error) return true;
    }
  } catch {
    // fallback
  }

  const idx = memoryCallbacks.findIndex((c) => c.id === id);
  if (idx !== -1) {
    memoryCallbacks.splice(idx, 1);
    return true;
  }
  return false;
}

export async function createCallbackRequest(
  input: CallbackRequestInput,
  userId: string
): Promise<{ id: string; status: string; is_duplicate?: boolean }> {
  // 1. Silent Honeypot Detection
  if (input.website_hp && input.website_hp.length > 0) {
    console.warn(`[Security] Honeypot triggered by bot from phone: ${input.phone}`);
    return { id: 'bot-filtered', status: 'filtered' };
  }

  const now = new Date();
  const currentTime = now.getTime();
  const todayStr = now.toISOString().split('T')[0];

  // 2. User-based Rate Limiting (max 5 requests per user per day)
  const userRate = userDailySubmissions.get(userId);
  if (userRate && userRate.day === todayStr) {
    if (userRate.count >= 5) {
      throw new AppError(
        'Daily limit reached: Maximum 5 callback requests per user per day.',
        429,
        'USER_RATE_LIMITED'
      );
    }
    userDailySubmissions.set(userId, { count: userRate.count + 1, day: todayStr });
  } else {
    userDailySubmissions.set(userId, { count: 1, day: todayStr });
  }

  // 3. Phone-Number Rate Limiting
  const tenMinutesAgo = currentTime - 10 * 60 * 1000;
  const recentPhoneTimestamps = (phoneSubmissions.get(input.phone) || []).filter(
    (ts) => ts > tenMinutesAgo
  );

  if (recentPhoneTimestamps.length >= 3) {
    throw new AppError(
      'Too many callback requests for this phone number. Our team has already received your inquiry and will call you shortly.',
      429,
      'PHONE_RATE_LIMITED'
    );
  }

  recentPhoneTimestamps.push(currentTime);
  phoneSubmissions.set(input.phone, recentPhoneTimestamps);

  // 4. Save New Inquiry Record with verified user_id
  const recordId = crypto.randomUUID();
  
  // 5. Lookup Package Title for Notification
  const matchedPkg = input.package_id
    ? SEED_PACKAGES.find((p) => p.id === input.package_id)
    : undefined;
  
  // Note: the rest of the app might still use CallbackRecord for now.
  // We construct the new inquiry schema object for insertion.
  const newInquiry = {
    id: recordId,
    user_id: userId, // login required, we already throw if no user_id (not shown here, but assumed verified)
    type: 'callback',
    package_id: input.package_id || null,
    package_slug: input.package_slug || null,
    package_title_snapshot: input.package_title || (input.package_id ? (matchedPkg?.title || 'Unknown Package') : null),
    name: input.name,
    phone: input.phone,
    email: input.email || '', // email is now NOT NULL in schema
    preferred_contact: 'whatsapp',
    travel_start_date: input.travel_from || null,
    travel_end_date: input.travel_to || null,
    group_size: input.group_size || 2,
    special_requests: input.special_requests || null,
    message: null,
    status: 'new',
    admin_notes: null,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  let savedToDb = false;

  try {
    if (
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      const { error } = await supabaseAdmin.from('inquiries').insert([newInquiry]);
      if (!error) {
        savedToDb = true;
      } else {
        console.error('[CallbackService] Supabase insert error:', error);
      }
    }
  } catch (err) {
    console.warn(
      '[CallbackService] Failed to insert into Supabase, saving to memory fallback:',
      err
    );
  }

  if (!savedToDb) {
    // keeping memory fallback matching old CallbackRecord for now to not break memory reads
    memoryCallbacks.unshift({
      id: recordId,
      user_id: userId,
      package_id: input.package_id || null,
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      travel_from: input.travel_from || null,
      travel_to: input.travel_to || null,
      group_size: input.group_size || 2,
      special_requests: input.special_requests || null,
      status: 'new',
      assigned_to: null,
      notes: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });
  }



  // 6. Asynchronous Non-blocking Email Notification via SendGrid
  sendCallbackNotifications({
    id: recordId,
    name: input.name,
    phone: input.phone,
    email: input.email || undefined,
    packageTitle: matchedPkg?.title,
    travelDates: {
      from: input.travel_from || undefined,
      to: input.travel_to || undefined,
    },
    groupSize: input.group_size,
    specialRequests: input.special_requests || undefined,
  }).catch((emailErr) => {
    console.error('[CallbackService] Background email dispatch error:', emailErr);
  });

  return { id: recordId, status: 'new' };
}
