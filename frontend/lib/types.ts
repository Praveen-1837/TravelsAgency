export interface ItineraryDay {
  day: number;
  title: string;
  altitude?: string;
  stay?: string;
  meals?: string;
  description: string;
  highlights?: string[];
}

export interface Package {
  id: string;
  slug: string;
  title: string;
  destination: string;
  duration_days: number;
  duration_nights: number;
  duration: string;
  price_per_person: number;
  original_price?: number;
  discount_percent?: number;
  price_unit: 'person' | 'couple';
  audience: string[];
  description: string;
  inclusions: string[];
  itinerary: ItineraryDay[];
  images: string[];
  rating_avg: number;
  review_count: number;
  is_featured: boolean;
  is_active: boolean;
}

export interface Review {
  id: string;
  package_id: string;
  traveler_name: string;
  rating: number;
  comment: string;
  photos?: string[];
  created_at: string;
  trip_label?: string;
  package_slug?: string;
  package_title?: string;
  helpful_count?: number;
  is_approved?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  name: string;
}

export interface CallbackRecord {
  id: string;
  package_id?: string | null;
  package_title?: string;
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

export interface AdminStats {
  total_inquiries: number;
  new_inquiries: number;
  contacted: number;
  converted: number;
  closed: number;
  conversion_rate: string;
  pending_reviews: number;
  active_packages: number;
  top_packages: { title: string; count: number; conversion: string }[];
}

export interface CallbackRequestPayload {
  package_id?: string | null;
  name: string;
  phone: string;
  email?: string;
  travel_from?: string;
  travel_to?: string;
  group_size?: number;
  special_requests?: string;
  website_hp?: string; // honeypot
}

export interface PackageFilters {
  destination?: string;
  audience?: 'couple' | 'group' | 'family';
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'duration';
  page?: number;
  limit?: number;
}
