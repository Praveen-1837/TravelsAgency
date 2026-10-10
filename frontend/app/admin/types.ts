export type AdminRole = 'Super Admin' | 'Lead Concierge' | 'Finance & Escrow'

export interface ConciergeStaff {
  id: string
  name: string
  role: AdminRole
  email: string
  phone: string
  regional_hub: 'Kashmir' | 'Kerala' | 'Rajasthan' | 'Andaman'
  two_factor: {
    enabled: boolean
    method: 'FIDO2' | 'TOTP'
  }
  last_pulse: string
  status: 'Active' | 'Away'
  avatar: string
  permissions_tier: string
}

export interface ConversationMessage {
  id: string
  sender: string
  senderRole: string
  timestamp: string
  channel: 'Direct Form' | 'WhatsApp' | 'Phone Call' | 'Internal Note'
  content: string
}

export interface Inquiry {
  id: string
  customer_name: string
  initials: string
  phone: string
  email: string
  location: string
  origin_channel: 'Direct Form' | 'WhatsApp'
  package_name: string
  package_id: string
  duration: string
  requested_dates: string
  party_size: number
  budget_range: string
  budget_min: number
  budget_max: number
  special_requests: string
  dietary_requirements: string
  created_at: string
  time_received_str: string
  is_overdue: boolean
  last_contacted_at: string
  contact_attempts: number
  assigned_concierge: {
    id: string
    name: string
    role: string
    last_activity: string
  }
  status: 'New' | 'Contacted' | 'Quote Sent' | 'Converted' | 'Lost'
  priority: 'Urgent' | 'High' | 'Normal'
  conversation_log: ConversationMessage[]
}

export interface BookingManifestGuest {
  name: string
  age: number
  relation: string
  passport_verified: boolean
  id_number_masked: string
}

export interface Booking {
  id: string
  inquiry_id?: string
  customer_id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  guest_initials: string
  package_name: string
  package_id: string
  package_duration: string
  departure_date: string
  return_date: string
  departure_time?: string
  party_size: string
  party_count: number
  total_amount: number
  paid_amount: number
  payment_status: 'Captured' | 'Pending' | 'Failed' | 'Refunded'
  chauffeur: {
    assigned: boolean
    name: string
    phone: string
    vehicle: string
    license_plate: string
  }
  voucher: {
    generated: boolean
    sent: boolean
    pdf_url: string
    due_urgent: boolean
    status: 'Ready' | 'Pending'
  }
  status: 'Confirmed' | 'Pending' | 'Enroute' | 'Completed' | 'Cancelled'
  guests: BookingManifestGuest[]
  blueprint: {
    itinerary_highlights: string[]
    inclusions: string[]
    special_requests: string
  }
  notes: {
    timestamp: string
    author: string
    text: string
  }[]
}

export interface Payment {
  id: string
  booking_id: string
  expedition: string
  customer_name: string
  customer_phone: string
  customer_email: string
  amount: number
  tranche_info: string
  currency: string
  gateway_status: 'Captured' | 'Pending' | 'Failed' | 'Refunded'
  payment_method: 'UPI' | 'Netbanking' | 'Credit Card' | 'Amex' | 'Axis Bank'
  timestamp: string
  razorpay_id: string
  retry_link_sent?: boolean
  failed_reason?: string
  refund_details?: {
    original_amount: number
    deduction_amount: number
    deduction_reason: string
    net_payout: number
    reason: string
    audit_note: string
    credit_note_id: string
    disbursement_method: string
    disbursed_at: string
  }
}

export interface Customer {
  id: string
  name: string
  initials: string
  email: string
  phone: string
  whatsapp: string
  upi_id: string
  location: string
  tier: 'Elite Sovereign' | 'VIP Club' | 'Frequent Voyager' | 'First-Time'
  tier_badge: 'SOVEREIGN VIP' | 'AZURE VOYAGER' | 'EXPLORER'
  lifetime_spend: number
  expedition_count: number
  trips_summary: string
  completed_trips: number
  enroute_trips: number
  repeat_intent_score: string
  nps_score: string
  status: 'Active' | 'Dormant'
  last_activity: string
  relationship_manager: {
    name: string
    role: string
  }
  co_travellers: {
    name: string
    relation: string
    passport_verified: boolean
  }[]
  bespoke_preferences: {
    dietary: string
    accommodations: string
    chauffeur: string
    passport_verified: boolean
    special_notes: string
  }
  expedition_history: {
    order_id: string
    expedition_name: string
    dates: string
    accommodation: string
    amount: number
    status: 'Confirmed' | 'Completed' | 'Enroute'
  }[]
  internal_notes: {
    timestamp: string
    author: string
    text: string
  }[]
}

export interface ReviewPhoto {
  url: string
  caption: string
  exif_verified: boolean
  raw_verified: boolean
}

export interface Review {
  id: string
  booking_id: string
  guest_name: string
  guest_initials: string
  tier: 'SOVEREIGN CLUB' | 'AZURE CLUB' | 'EXPLORER'
  expedition: string
  dates: string
  rating: number
  submitted_time: string
  review_quote: string
  review_text: string
  photos: ReviewPhoto[]
  safety_sentiment: 'PASSED' | 'FLAGGED'
  photo_checks: 'VERIFIED (3 RAW)' | 'UNVERIFIED'
  guest_authentication: 'MATCHED (PNR-770)' | 'PENDING'
  auto_moderation: 'Clean' | 'Flagged'
  status: 'Pending' | 'Published' | 'Featured' | 'Archived'
  syndicate_targets: string[]
  official_reply?: {
    author: string
    timestamp: string
    text: string
  }
}

export interface RBACMatrixDomain {
  domain: string
  superAdmin: string
  leadConcierge: string
  finance: string
}

export interface IntegrationStatus {
  supabase: { status: 'Online'; latency: string; region: string }
  razorpay: { status: 'Active'; sync: string; liveKey: string }
  whatsappBot: { status: 'Connected'; uptime: string; businessNumber: string }
  webhookHealth: { status: 'Status 200 OK'; desyncs: number }
}
