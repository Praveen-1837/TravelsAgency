# AARIVA VOYAGES - PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Version:** 1.0  
**Last Updated:** September 27, 2026  
**Company:** Aariva Voyages Pvt. Ltd.  
**Location:** Tirupala Gardens, Bandlaguda Jagir, Hyderabad

---

## 1. EXECUTIVE SUMMARY

**Aariva Voyages** is a domestic travel package website designed to capture customer inquiries via a callback model. Instead of direct bookings, customers submit their details through "Request Callback" forms, and the Aariva Voyages team calls them within 2 hours to customize packages and confirm bookings.

**Mission:** Curated Journeys. Timeless Memories.

---

## 2. PRODUCT VISION

Build a modern, minimalist travel package discovery platform that:
- Showcases 10-20 domestic packages (Sikkim, Assam-Meghalaya, Andaman, Lakshadweep, Kashmir)
- Captures qualified leads via callback forms (not direct bookings)
- Builds trust through visible reviews, ratings, and social proof
- Serves couples (honeymoon) and groups (family, friends) equally
- Drives conversions from 3-5% to 8-12% through inquiry system transparency

---

## 3. TARGET USERS

### Primary Users:
1. **Honeymoon Couples** (25-40 years old)
   - Budget: ₹15K - ₹1L per person
   - Pain point: Want customized, romantic experiences
   - Motivation: Social proof, trust signals

2. **Family Groups** (30-55 years old)
   - 4-6 people, budget-conscious
   - Pain point: Overwhelmed by options
   - Motivation: Safety, clear itineraries, good value

3. **Friend Groups** (22-35 years old)
   - Budget: ₹11K - ₹30K per person
   - Pain point: Coordination, group discounts
   - Motivation: Excitement, adventure, live traveler counts

### Secondary Users:
4. **Corporate MICE** (HR/Event managers)
   - Groups: 20-100+ people
   - Pain point: Custom requirements, billing
   - Motivation: Team bonding, cost control

---

## 4. KEY FEATURES

### Must-Have (MVP):
- ✅ Homepage with hero, featured packages, testimonials
- ✅ Package listing page with filters (by feeling, duration, price)
- ✅ Package detail page with accordion itinerary, inclusions, reviews
- ✅ "Request Callback" modal form on every package
- ✅ Visible star ratings + review counts (Thrillophilia-style)
- ✅ Admin dashboard to manage callbacks, packages, reviews
- ✅ Email notifications (customer confirmation + admin alert)

### Should-Have (Phase 2):
- 🔄 User accounts & booking history
- 🔄 Wishlist / saved packages
- 🔄 Live chat support
- 🔄 Payment integration (deposit, installments)
- 🔄 Analytics dashboard (conversion funnel, traffic sources)

### Nice-to-Have (Phase 3+):
- 💡 AI-powered package recommendations
- 💡 Video tours of destinations
- 💡 Guest reviews with photos
- 💡 Blog / travel guides
- 💡 Mobile app

---

## 5. USER JOURNEYS

### Journey 1: Discovering & Inquiring (Most Common)
```
1. Land on homepage → See featured packages
2. Click "Browse Packages" → See all domestic options
3. Filter by "Romantic" or "Adventure" or price
4. Click on Andaman card → See detail page
5. Scroll through itinerary, reviews, inclusions
6. Click "Request Callback" → Fill form → Submit
7. Receive email confirmation: "We'll call you in 2 hours"
8. Aariya team calls → customize dates, price, extras
9. Confirm booking → provide payment details
```

### Journey 2: Direct Inquiry (Homepage)
```
1. Land on homepage
2. Click "Request a Callback" in hero or footer CTA
3. Fill form (no package pre-selected)
4. Aariya team calls → suggest packages based on preferences
```

### Journey 3: Admin Approving Reviews
```
1. Admin logs in → Callbacks tab
2. See pending review from customer
3. Click "Approve" → review shows on package detail page
```

---

## 6. SUCCESS METRICS

| Metric | Target | Current |
|--------|--------|---------|
| Homepage bounce rate | < 40% | TBD |
| Callback form completion | > 60% | TBD |
| Callback → Booking conversion | 8-12% | 3-5% (current) |
| Avg session duration | > 2 min | TBD |
| Package view depth | Itinerary scroll | TBD |
| Review count (3 months) | 20+ reviews | 0 (new site) |
| Email open rate | > 25% | TBD |

---

## 7. PACKAGES (INITIAL INVENTORY)

### Domestic Packages (Domestic Focus):

| Package | Duration | Price | Category | Target |
|---------|----------|-------|----------|--------|
| Sikkim-Darjeeling | 5N/6D | ₹11,300 | Adventure | Families |
| Assam-Meghalaya | 6N/7D | ₹15,800 | Adventure | Groups |
| Andaman Paradise | 4N/5D | ₹14,800 | Beach/Relax | Couples & Families |
| Lakshadweep | 4N/5D | ₹24,800 | Luxury/Beach | Couples |
| Kashmir Honeymoon | 4N/5D | ₹14,999 | Romantic | Couples |
| Andaman Luxury Honeymoon | 5N/6D | ₹1,00,000 | Luxury/Romantic | Premium Couples |

**All prices:** Per person, GST included (except Luxury which is per couple)

---

## 8. BUSINESS MODEL

- **Revenue:** Commission per confirmed booking (TBD % with operators)
- **Lead cost:** Negligible (own website)
- **Conversion funnel:** Website → Callback form → Phone call → Booking
- **Average booking value:** ₹40K - ₹80K per customer
- **Target:** 10-50 bookings/month by Month 3

---

## 9. COMPETITIVE DIFFERENTIATION

| Aspect | Aariya | Thrillophilia | MakeMyTrip |
|--------|--------|---------------|-----------|
| Callback model | ✅ Yes | ❌ Booking-first | ❌ Booking-first |
| Review visibility | ✅ Prominent | ✅ Prominent | ✅ Prominent |
| Domestic-only | ✅ Yes | ❌ Mixed | ❌ Mixed |
| Live traveler badges | ✅ Planned | ✅ Yes | ❌ No |
| 24/7 support | ✅ Yes | ✅ Yes | ✅ Yes |
| Custom packages | ✅ Via callback | ✅ Limited | ✅ Limited |

---

## 10. LAUNCH PLAN

| Timeline | Milestone |
|----------|-----------|
| Week 1-2 | Project setup, database, auth |
| Week 3-4 | Backend API, homepage, package cards |
| Week 5-6 | Listing page, detail page, callback modal |
| Week 7-8 | Admin dashboard, email integration |
| Week 9-10 | Booking flow, analytics, reviews |
| Week 11 | Testing, bug fixes, security audit |
| Week 12 | Deploy to Vercel, domain setup, launch 🚀 |

**Target Launch:** December 2026

---

## 11. TECHNICAL CONSTRAINTS

- **Frontend:** React 18 + Next.js 14 (Vercel)
- **Backend:** Node.js + Express (Railway)
- **Database:** Supabase PostgreSQL
- **Hosting cost (Y1):** ₹0-5,000 (mostly free tier)
- **Dev cost:** ₹1.5L - ₹2.5L (freelancer/agency)

---

## 12. SUCCESS DEFINITION

**MVP Success** (Month 1):
- Website live at aarivavoyages.com
- 100+ unique visitors/month
- 5+ callback requests
- Admin dashboard working

**Traction** (Month 3):
- 500+ monthly visitors
- 30-50 callback requests
- 8-12 confirmed bookings
- 5+ verified reviews

**Scale** (Month 6+):
- 2000+ monthly visitors
- 100+ callback requests
- 50+ bookings/month
- Profitability

---

## 13. OUT OF SCOPE (Phase 2+)

- Direct credit card booking (callback is lead capture)
- International packages
- Travel insurance integration
- Visa support services
- Hotel-only bookings
- Flight-only bookings

---

**Document Owner:** Aariva Voyages Team  
**Last Review:** 27 Sep 2026  
**Next Review:** 31 Dec 2026
