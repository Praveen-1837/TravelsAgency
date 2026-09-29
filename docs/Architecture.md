# Aariva Voyages — Architecture

## 1. Overview
Aariva Voyages is a domestic-travel website (PAN India) built around a **callback inquiry model**: visitors browse packages, read reviews, and submit a "Request Callback" form. The Aariva team follows up via WhatsApp/phone. An admin dashboard manages packages, callback requests, and reviews.

## 2. System Diagram
```
 Browser (Mobile / Desktop)
        |
        v
 Next.js (React) on Vercel  ---- SSR/ISR pages, package listing & detail
        |
        v  REST (JSON)
 Node.js + Express on Railway
        |
        +--> Supabase PostgreSQL   (packages, inquiries, reviews, users)
        +--> Supabase Auth         (admin login)
        +--> Supabase Storage      (package & traveler photos)
        +--> SendGrid              (team notification + customer confirmation emails)
```

## 3. Components
| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React + Next.js (Vercel) | Public site, package pages, callback form, admin UI |
| Backend | Node.js + Express (Railway) | REST API, validation, notifications, admin operations |
| Database | Supabase PostgreSQL | Core data, row-level security |
| Auth | Supabase Auth | Admin/staff login and role checks |
| Storage | Supabase Storage (5GB free) | Package images, traveler review photos |
| Email | SendGrid (100/day free) | New-inquiry alerts, confirmation emails |
| Payments | Razorpay (Phase 2) | Deferred; current model is callback-only, not "Book Now" |

## 4. Data Model (core tables)
- **packages**: id, slug, title, destination, duration, price_per_person, audience (couple/group/family), inclusions, itinerary (JSON), images, rating_avg, review_count, is_active
- **callback_requests**: id, package_id, name, phone, email, travel_dates, group_size, special_requests, status (new / contacted / converted / closed), assigned_to, notes, created_at
- **reviews**: id, package_id, traveler_name, rating (1–5), comment, photos[], is_approved, created_at
- **admin_users**: managed via Supabase Auth with a role field

## 5. Key Design Decisions
- **Callback over booking:** primary CTA is "Request Callback"; no checkout in Phase 1.
- **Domestic packages only:** Sikkim-Darjeeling, Assam-Meghalaya, Andaman, Lakshadweep, Kashmir Couple Special, Andaman Luxury Honeymoon.
- **Reviews are visible everywhere:** "4.7 • 128 reviews" on cards; full reviews with traveler photos on detail pages. Collected manually at first, automated later.
- **Honeymoon and group/family packages are equally prominent.**
- **Static generation (ISR)** for package pages for speed and SEO.

## 6. Security
- Supabase Row-Level Security: public read on active packages/approved reviews; inquiries write-only for the public, read for admins.
- Server-side validation and rate limiting on the callback form (spam protection, e.g. honeypot or CAPTCHA).
- Admin routes protected by Supabase JWT + role check.
- HTTPS everywhere; secrets in environment variables only.

## 7. Scalability & Cost
- Initial load: roughly 10–50 inquiries/month, well within free tiers.
- Hosting: Vercel free (frontend), Railway ~₹0–500/month (backend).
- Scale path: paid Supabase tier, WhatsApp Business API, Razorpay checkout.

## 8. Timeline
12-week build targeting a December 2026 launch.
