# Aariva Voyages — API Guide

**Base URL:** `https://api.<domain>/api` (Node.js + Express on Railway)
**Format:** JSON. **Auth:** public endpoints open; admin endpoints need `Authorization: Bearer <Supabase JWT>`.

## 1. Conventions
- Plural nouns, kebab-case paths.
- Success: `200/201` with `{ "data": ... }`.
- Errors: `{ "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [...] } }`
- Pagination: `?page=1&limit=12`, response includes `meta: { page, limit, total }`.

| Status | Meaning |
|---|---|
| 400 | Validation error |
| 401 | Missing/invalid token |
| 403 | Not permitted |
| 404 | Not found |
| 429 | Rate limited |
| 500 | Server error |

## 2. Public Endpoints

### GET /packages
Query: `destination`, `audience` (couple|group|family), `minPrice`, `maxPrice`, `duration`, `sort` (price|rating|duration), `page`, `limit`.
```json
{ "data": [{ "id": "uuid", "slug": "sikkim-darjeeling", "title": "Sikkim-Darjeeling",
  "duration": "6N/7D", "price_per_person": 11300, "rating_avg": 4.7,
  "review_count": 128, "image": "https://…" }], "meta": { "page": 1, "limit": 12, "total": 6 } }
```

### GET /packages/:slug
Full detail: description, itinerary, inclusions, images, rating summary.

### GET /packages/:slug/reviews
Approved reviews with traveler photos; supports `page`, `limit`.

### POST /callbacks
```json
{ "package_id": "uuid", "name": "Riya S", "phone": "9876543210",
  "email": "riya@example.com", "travel_from": "2026-12-10", "travel_to": "2026-12-16",
  "group_size": 2, "special_requests": "Honeymoon decoration" }
```
Response `201`: `{ "data": { "id": "uuid", "status": "new" } }`
Rate limited; phone must be a valid 10-digit Indian mobile.

## 3. Admin Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | /admin/callbacks | List (filter: status, package, date range) |
| GET | /admin/callbacks/:id | Detail |
| PATCH | /admin/callbacks/:id | Update status, notes, assigned_to |
| GET | /admin/packages | List all incl. inactive |
| POST | /admin/packages | Create |
| PUT | /admin/packages/:id | Update |
| DELETE | /admin/packages/:id | Deactivate/delete |
| POST | /admin/reviews | Add review (manual collection) |
| PATCH | /admin/reviews/:id | Approve, edit |
| DELETE | /admin/reviews/:id | Remove |
| POST | /admin/uploads | Upload image to Supabase Storage |
| GET | /admin/stats | Requests, conversion rate, top packages |

## 4. Example: Update a Callback
`PATCH /api/admin/callbacks/:id`
```json
{ "status": "contacted", "notes": "Called, sending itinerary on WhatsApp" }
```

## 5. Notifications
On `POST /callbacks`: save to database first, then send the team alert and customer confirmation via SendGrid; email failure never fails the request.

## 6. Versioning
Start unversioned; move to `/api/v2` if breaking changes are needed.
