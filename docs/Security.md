# Aariva Voyages — Security

## 1. Scope
Public marketing site with a callback inquiry form, plus an admin dashboard. Personal data collected: name, phone, email, travel dates, group size, special requests.

## 2. Authentication & Authorization
- Admin/staff login via Supabase Auth; public visitors do not need accounts.
- Role field on admin users (`admin`, `staff`); every admin route checks the JWT and the role.
- Short session lifetimes; enforce strong passwords; enable MFA for admin accounts.

## 3. Database (Supabase PostgreSQL)
Row-Level Security enabled on every table.
| Table | Public | Admin/Staff |
|---|---|---|
| packages | read active only | full access |
| reviews | read approved only | full access |
| callback_requests | insert only (through API) | read, update |
- The service-role key is used only on the backend, never in the frontend bundle.

## 4. Input Handling
- Validate every request server-side (schema validation, e.g. zod/joi); never trust client checks.
- Phone: 10-digit Indian mobile; email format check; length limits on free-text fields.
- Parameterized queries only; sanitize/escape output to prevent XSS; no raw HTML from user input.

## 5. Abuse Protection
- Rate limit `POST /api/callbacks` (per IP and per phone number).
- Honeypot field and/or CAPTCHA on the callback form.
- Deduplicate: same phone and package within 24 hours is merged.

## 6. Transport & Headers
- HTTPS only, HSTS enabled.
- CORS restricted to the Aariva Voyages frontend origins.
- Security headers: Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Referrer-Policy.

## 7. Secrets
- All keys in environment variables (Vercel, Railway); never committed to Git.
- Separate keys for dev, staging, production; rotate on suspected exposure.
- `.env*` files in `.gitignore`.

## 8. File Uploads (Supabase Storage)
- Only admins upload; accept jpg/png/webp; max size limit; rename files; store in public buckets only for approved images.

## 9. Privacy
- Collect only what is needed to call the customer back.
- Privacy policy and consent text near the callback form.
- Admin can delete a customer's request on demand.
- Do not log phone numbers or emails in application logs.

## 10. Monitoring & Backups
- Error tracking on backend and frontend.
- Supabase automated backups; test restore before launch.
- Alert on unusual spikes in callback submissions.

## 11. Pre-Launch Checklist
- [ ] RLS policies tested for public vs admin
- [ ] Rate limiting and CAPTCHA active
- [ ] No secrets in repo or client bundle
- [ ] Admin MFA on
- [ ] Dependency audit (`npm audit`) clean
- [ ] Backup restore verified
