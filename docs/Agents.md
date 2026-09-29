# Aariva Voyages — Agents Guide

Instructions for AI coding agents working in this repository.

## 1. Project Summary
Aariva Voyages is a domestic-travel website (PAN India). Visitors browse packages and submit a **Request Callback** form; the team follows up by WhatsApp/phone. There is **no online booking or payment in Phase 1**. Payments (Razorpay) are Phase 2.

## 2. Stack
React + Next.js (Vercel) · Node.js + Express (Railway) · Supabase (PostgreSQL, Auth, Storage) · SendGrid.

## 3. Read First
| Topic | File |
|---|---|
| System design | Architecture.md |
| User journeys | Appflow.md |
| Requirements and milestones | TechSpec.md |
| Tables and RLS | Database.md |
| Endpoints | API-Guide.md |
| Conventions | Code-style.md |
| UI tokens and components | Design-system.md |
| Security rules | Security.md |

## 4. Rules
1. The primary CTA is **"Request Callback"**, never "Book Now".
2. Domestic packages only.
3. Show ratings on every package card as "4.7 • 128 reviews".
4. Follow Design-system.md: the Figma-derived tokens (orange #FF5722 CTA, Plus Jakarta Sans, 12px-radius white cards, subtle shadow).
5. Validate all input server-side; never expose the Supabase service-role key to the frontend.
6. Save a callback request to the database before sending any email.
7. Every table keeps Row-Level Security enabled.
8. Write tests with each feature; keep changes small and focused.
9. Replace the Figma brand "ThrillVibe" with the real name and "Book Now" with "Request Callback"; the checkout frame is Phase 2.
10. Use the brand name exactly as **Aariva Voyages** in code, copy, and docs.

## 5. Workflow
1. Read the relevant docs above.
2. Make a short plan before large changes.
3. Implement following Code-style.md.
4. Run lint and tests locally.
5. Use Conventional Commits and open a PR with a clear description.

## 6. Do Not
- Add dependencies without a clear need.
- Commit secrets or `.env` files.
- Change the database schema without a migration.
- Add international packages or online checkout without approval.
- Invent prices, reviews, or ratings; use real data from the admin dashboard.

## 7. Open Decisions
- Sticky header behavior.
- Timing of Razorpay checkout and WhatsApp Business API.
