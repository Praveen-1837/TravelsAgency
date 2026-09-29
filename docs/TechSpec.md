# Aariva Voyages — Technical Specification

## 1. Stack
- **Frontend:** React, Next.js (Vercel)
- **Backend:** Node.js, Express (Railway.app)
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Email:** SendGrid
- **Payments:** Razorpay (2% + ₹10 per transaction), Phase 2 only

## 2. Functional Requirements
1. Public package listing and detail pages for domestic packages.
2. Star rating and review count on cards; full reviews with photos on detail pages.
3. "Request Callback" form: phone, email, travel dates, group size, special requests.
4. Admin dashboard: manage callback requests, packages, reviews, basic analytics.
5. Email notifications on new requests.
6. Wishlist (registered users, optional Phase 2).

## 3. API Endpoints
**Public**
- `GET /api/packages` — list (filters: destination, audience, price, duration; sort)
- `GET /api/packages/:slug` — detail
- `GET /api/packages/:slug/reviews` — approved reviews
- `POST /api/callbacks` — submit callback request

**Admin (JWT + role)**
- `GET /api/admin/callbacks`, `GET /api/admin/callbacks/:id`
- `PATCH /api/admin/callbacks/:id` — status, notes, assignee
- `POST/PUT/DELETE /api/admin/packages`
- `POST/PATCH/DELETE /api/admin/reviews`
- `GET /api/admin/stats`

## 4. Callback Request Payload
```json
{
  "package_id": "uuid",
  "name": "string",
  "phone": "string (10-digit Indian mobile)",
  "email": "string",
  "travel_dates": { "from": "date", "to": "date" },
  "group_size": 2,
  "special_requests": "string"
}
```

## 5. Data Model
See Architecture.md, section 4. Key indexes: `packages(slug)`, `callback_requests(status, created_at)`, `reviews(package_id, is_approved)`.

## 6. Design System
Extracted from the Figma design; full details in Design-system.md.
- Font: Plus Jakarta Sans (400–800). Type scale: 56 / 40 / 22 / 18 / 15 / 13 / 10–11.
- Colors: CTA #FF5722, orange text #B02F00, success #006C49, amber #F59E0B, ink #191C1E, body #5B4039, slate #565E74, dark #2D3133, page #F7F9FB.
- Layout: 1280 frame, 1216 container, 12-column grid, 3-column card grid, 286px listing sidebar.
- Radius 4 / 8 / 12 / full; cards white with a subtle shadow.
- Breakpoints: mobile <640px, tablet 640–1024px, desktop >1024px.
- Frames: Home, Package Listing, Package Detail (desktop + mobile), Checkout (Phase 2).

## 7. Non-Functional Requirements
- **Performance:** ISR/static package pages, WebP images, lazy loading, target LCP under 2.5s on 4G.
- **Accessibility:** WCAG AA, 44px touch targets, visible focus states, semantic HTML.
- **Security:** RLS policies, input validation, rate limiting, CAPTCHA/honeypot, HTTPS, secrets in env vars.
- **SEO:** clean slugs, meta tags, structured data (TouristTrip, AggregateRating).
- **Reliability:** inquiries persisted before email is attempted; retry on notification failure.

## 8. Environments & Deployment
- Dev / Staging / Production with separate Supabase projects.
- CI on GitHub: lint, test, preview deploys on Vercel; Railway auto-deploy from main.

## 9. Testing
Unit tests (validation, services), API integration tests, E2E for the callback flow (Playwright), manual accessibility and mobile checks.

## 10. Milestones (12 weeks, Dec 2026 launch)
| Weeks | Milestone |
|---|---|
| 1–2 | Design finalization, DB schema, project setup |
| 3–5 | Package listing and detail pages, reviews UI |
| 6–7 | Callback form, notifications, backend APIs |
| 8–9 | Admin dashboard |
| 10 | SEO, performance, accessibility pass |
| 11 | QA and content loading (six packages) |
| 12 | Launch |

## 11. Cost
Development ₹1.5–2.5L; hosting ₹0–5K/year initially.
