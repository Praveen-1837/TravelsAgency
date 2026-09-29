# Aariva Voyages — Database

**Engine:** Supabase PostgreSQL. Auth users live in Supabase's `auth.users`; app tables reference them by UUID.

## 1. Tables

### packages
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | default gen_random_uuid() |
| slug | text unique | URL-friendly |
| title | text | |
| destination | text | e.g. Sikkim-Darjeeling |
| duration_days / duration_nights | int | |
| price_per_person | numeric(10,2) | INR |
| price_unit | text | `person` or `couple` |
| audience | text[] | couple, group, family |
| description | text | |
| inclusions | text[] | |
| itinerary | jsonb | day-by-day |
| images | text[] | Supabase Storage URLs |
| rating_avg | numeric(2,1) | maintained from reviews |
| review_count | int | maintained from reviews |
| is_featured / is_active | boolean | |
| created_at / updated_at | timestamptz | |

### callback_requests
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| package_id | uuid FK -> packages | nullable (general inquiry) |
| name | text | |
| phone | text | required |
| email | text | |
| travel_from / travel_to | date | optional |
| group_size | int | |
| special_requests | text | |
| status | text | new, contacted, converted, closed |
| assigned_to | uuid FK -> auth.users | nullable |
| notes | text | internal |
| created_at / updated_at | timestamptz | |

### reviews
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| package_id | uuid FK -> packages | |
| traveler_name | text | |
| rating | int | check 1–5 |
| comment | text | |
| photos | text[] | traveler photo URLs |
| is_approved | boolean | default false |
| created_at | timestamptz | |

### admin_users
| Column | Type | Notes |
|---|---|---|
| id | uuid PK FK -> auth.users | |
| role | text | admin, staff |
| created_at | timestamptz | |

## 2. Relationships
```
packages 1 ─── * reviews
packages 1 ─── * callback_requests
auth.users 1 ─── 1 admin_users
admin_users 1 ─── * callback_requests (assigned_to)
```

## 3. Indexes
- `packages(slug)` unique, `packages(is_active, is_featured)`
- `callback_requests(status, created_at desc)`, `callback_requests(phone)`
- `reviews(package_id, is_approved)`

## 4. Rating Maintenance
A trigger on `reviews` (insert/update/delete of approved reviews) recalculates `packages.rating_avg` and `review_count`, so cards can show "4.7 • 128 reviews" without heavy queries.

## 5. Row-Level Security
- `packages`: public SELECT where `is_active`; admin write.
- `reviews`: public SELECT where `is_approved`; admin write.
- `callback_requests`: no public SELECT; inserts through backend API; admin/staff SELECT/UPDATE.

## 6. Seed Data (launch packages)
Sikkim-Darjeeling (₹11,300/person), Assam-Meghalaya (₹15,800/person), Andaman 4N/5D (₹14,800–15,901/person), Lakshadweep (₹24,800/person), Kashmir Couple Special (₹14,999/person), Andaman Luxury Honeymoon (₹1,00,000/couple).

## 7. Migrations & Backups
- Schema changes via versioned SQL migrations (Supabase CLI), reviewed in PRs.
- Automated Supabase backups; test a restore before launch.
