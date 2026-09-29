# AARIYA VOYAGES - DEVELOPER MEMORY & CONTEXT

**Version:** 1.0  
**Last Updated:** September 27, 2026  
**Read this FIRST before starting any development.**

---

## 1. COMPANY SNAPSHOT

**Name:** Aariva Voyages (Aariva Voyage Pvt. Ltd.)  
**Location:** Tirupala Gardens, Bandlaguda Jagir, Hyderabad  
**Phone:** +91 9035107020 / +91 9742567379  
**Email:** aarivavoyage@gmail.com  
**Website:** aarivavoyages.com (building)  
**Tagline:** "Curated Journeys. Timeless Memories."

---

## 2. WHAT AARIYA VOYAGES DOES

Aariva Voyages organizes **domestic travel packages** for:
- Honeymoon couples (romantic getaways)
- Family groups (4-6 people)
- Friend groups (adventure/relaxation)

**No international packages. No direct bookings. Only domestic packages + callback inquiry model.**

---

## 3. THE CALLBACK MODEL (CRITICAL)

This is NOT like Thrillophilia or MakeMyTrip. This is fundamentally different:

**Traditional Model (MakeMyTrip):**
```
Homepage → Package Detail → Add to Cart → Checkout → Book → Pay
```

**Aariva Voyages Model (Callback-Driven):**
```
Homepage → Package Detail → [Request Callback] → Form Submit → 
  Email Confirmation → Our Team Calls in 2 Hours → 
  Customize Package → Confirm → Payment Details Sent → Book
```

**Key Differences:**
- ✅ No "Book Now" button on the website
- ✅ No shopping cart / checkout flow
- ✅ Form asks: Name, Phone, Email, Travel Date, Group Size, Trip Type, Special Requests
- ✅ Admin dashboard to manage incoming callback requests
- ✅ Email to customer: "We'll call you in 2 hours"
- ✅ Email to admin: "New callback request from [name]"
- ✅ Aariya team calls customer to customize and confirm

**Why?** Callback model:
- Builds trust (direct conversation before commitment)
- Captures more info (preferences, budget, special needs)
- Higher conversion rate (8-12% vs 3-5%)
- Allows customization (Aariya can bundle, discount, tweak itinerary)

---

## 4. THE BUSINESS MODEL

**Packages offered:** 6 core domestic packages
- Sikkim-Darjeeling (₹11,300/person)
- Assam-Meghalaya (₹15,800/person)
- Andaman Paradise (₹14,800/person)
- Lakshadweep (₹24,800/person)
- Kashmir Honeymoon (₹14,999/person)
- Andaman Luxury Honeymoon (₹1,00,000/couple)

**Revenue model:** Commission from package operators (not transaction fees)

**Target:** 10-50 bookings/month within 3 months of launch

**Metrics that matter:**
- Callback form completion rate (target: 60%+)
- Callback → Phone call conversion (target: 80%+)
- Phone call → Booking conversion (target: 10-12%)
- Website bounce rate (target: < 40%)

---

## 5. DESIGN INSPIRATION: THRILLOPHILIA

We're inspired by Thrillophilia.com but adapted for callback model:

**What we steal from Thrillophilia:**
- ✅ Flat card design (1px border, no shadow, hover: border darkens)
- ✅ Visible star ratings on package cards (4.9 ★ • 156 reviews)
- ✅ "Live X Travellers On Trip" badges (social proof)
- ✅ Accordion-style itinerary (expandable day-by-day)
- ✅ Trust signals everywhere (reviews, support, hidden charges)
- ✅ "Browse by Feeling" tabs (Romantic/Adventure/Relaxing/Family)
- ✅ Clean, modern minimalist aesthetic

**What's different:**
- ❌ No "Book Now" CTA (we use "Request Callback")
- ❌ No payment integration (just data collection)
- ❌ No cart/checkout flow
- ❌ Heavy emphasis on callback form (main CTA)

---

## 6. DESIGN SYSTEM (MEMORIZE THIS)

### Colors
```
Primary text:        #202020 (dark gray)
Secondary text:      #515151 (medium gray)
Tertiary/captions:   #8E8E8E (light gray)
Accent (trust):      #0B822A (eco green)
Accent (urgency):    #F37002 (orange) ← Aariya brand color
Border (default):    #E0E0E0 (light)
Border (hover):      #CBCBCB (darker)
Background:          #F8F8F8 (off-white)
Star rating:         #FFB800 (yellow)
```

### Typography
- Font: Poppins, Inter, system fonts (no web fonts for speed)
- Body: 16px, line-height 1.6
- H1: 2.5rem, H2: 2rem, H3: 1.5rem
- Weights: 400 (normal), 600 (semi-bold) only

### Spacing (8px grid)
- XS: 4px | SM: 8px | MD: 16px | LG: 24px | XL: 32px

---

## 7. THE 6 CORE PACKAGES (REMEMBER)

| # | Name | Duration | Price | Category | Target | GST |
|---|------|----------|-------|----------|--------|-----|
| 1 | Sikkim-Darjeeling | 5N/6D | ₹11,300 | Adventure | Families | Incl |
| 2 | Assam-Meghalaya | 6N/7D | ₹15,800 | Adventure | Groups | Incl |
| 3 | Andaman Paradise | 4N/5D | ₹14,800 | Beach | Couples+Families | Incl |
| 4 | Lakshadweep | 4N/5D | ₹24,800 | Luxury | Couples | Incl |
| 5 | Kashmir Honeymoon | 4N/5D | ₹14,999 | Romantic | Couples | Incl |
| 6 | Andaman Luxury | 5N/6D | ₹1,00,000 | Luxury | Premium Couples | Per couple |

**Key rules:**
- All prices GST-inclusive except Luxury (per couple)
- Minimum 6 adults for group packages
- Couple packages have pink/red branding
- Family/group packages have standard branding

---

## 8. TECH STACK (MEMORIZE)

### Frontend
- React 18
- Next.js 14 (App Router)
- Tailwind CSS
- No TypeScript (JavaScript only)
- Vercel deployment

### Backend
- Node.js + Express
- API route handlers in Next.js
- Railway deployment (₹0-500/month)

### Database
- Supabase (PostgreSQL)
- Free tier: 500MB storage, unlimited reads
- Row-level security enabled
- Indexes on: is_featured, category, status

### Auth & Storage
- Supabase Auth (email/password only)
- Supabase Storage for images (5GB free)
- Admin-only protected routes

### Email
- SendGrid API (100/day free)
- Templates: callback-confirmation (to customer), callback-notification (to admin)

### Payments (Future)
- Razorpay (2% + ₹10 per transaction)
- Deposit payment only (not full booking price yet)

---

## 9. KEY PAGES TO BUILD

| Page | Purpose | CTA | Status |
|------|---------|-----|--------|
| Homepage | Discover, browse, inspire | "Request Callback" | MVP |
| /packages | List all with filters | "View Details" → Detail page | MVP |
| /packages/[slug] | Detail, itinerary, reviews | "Request Callback" | MVP |
| /admin | Dashboard overview | Manage callbacks | MVP |
| /admin/callbacks | Manage inquiries | Change status | MVP |
| /admin/packages | Add/edit packages | CRUD | MVP |
| /admin/reviews | Approve reviews | Toggle approval | MVP |
| /admin/login | Auth | Sign in | MVP |

---

## 10. THE CALLBACK FORM (MOST CRITICAL)

This is the money maker. Every detail matters:

**Fields (in order):**
1. Full Name* (required)
2. Phone Number* (required, Indian mobile format)
3. Email Address* (required)
4. Preferred Call Time (select: Morning/Midday/Afternoon/Evening)
5. Travel Date* (required, date picker, min: today)
6. Number of Travelers* (select: 1 / 2 (Couple) / 3-4 / 5-6 / 7-10 / 10+)
7. Trip Type (select: Honeymoon / Family / Friends / Solo / Corporate)
8. Special Requests (textarea, optional)

**Form behavior:**
- Modal popup (triggered by "Request Callback" button)
- Package name pre-fills if coming from package page
- On submit:
  1. Validate all required fields
  2. Send to /api/callback-requests (POST)
  3. Save to Supabase: callback_requests table
  4. Send email to customer: "We'll call you within 2 hours"
  5. Send email to admin: Full callback details
  6. Show success: "Request received! Check your email."
- Mobile: Form should be tappable, easy to fill on phone

**Design notes:**
- Modal width: 500px max
- Smooth fade-in animation
- Close button (✕) top-right
- Close on backdrop click
- Trust strip: ✅ Free • ✅ No commitment • ✅ 2-hour response

---

## 11. REVIEWS SYSTEM (VISIBLE LIKE THRILLOPHILIA)

**Every package card shows:**
```
★★★★★ 4.9 • 156 reviews
```

**On detail page:**
- Large rating card: 4.9 / 156 reviews
- Rating distribution (5 stars: 120 | 4 stars: 30 | etc.)
- Individual review cards (show 3, "See All" loads more)
  - Name • Trip type • Star rating • Date • Review text
- "Be first to review" if no reviews yet

**Admin flow:**
- Reviews start as is_approved: false
- Admin must approve to show on website
- Admin can view: Pending | Approved tabs
- Can unapprove if needed

**Collecting reviews:**
- Start manual: Aariya team adds existing customer reviews
- Add form later: After booking confirmation

---

## 12. LIVE TRAVELER BADGES (SOCIAL PROOF)

Cards show:
```
🔴 Live 12 Travellers
```

Red pulsing dot + count (animated, updates hourly)

**How it works:**
- Admin manually updates live_traveler_count in database
- Frontend fetches and displays
- Button refresh: Re-fetch every hour
- Mobile shows same badge

**Why it matters:**
- Reduces "is this real?" skepticism
- FOMO effect increases callback rate
- Shows trust (real people booking now)

---

## 13. ADMIN ACCESS

**Admin login:**
- Email: aarivavoyage@gmail.com (or multiple admins later)
- Password: Set during setup
- Session timeout: 1 hour
- Can manage:
  - All callback requests (view, add notes, change status)
  - All packages (add, edit, delete, toggle active)
  - All reviews (approve/reject)
  - Analytics (coming Phase 2)

---

## 14. WHAT WE'RE NOT DOING (FIRST 12 WEEKS)

❌ No user accounts yet (future feature)  
❌ No wishlist / saved packages  
❌ No payment integration (deposit only via WhatsApp)  
❌ No live chat  
❌ No AI recommendations  
❌ No blog / guides  
❌ No video tours  
❌ No 360° photos  

**Focus:** Get the callback model working perfectly, then expand.

---

## 15. TIMELINE & DEADLINES

**Project Start:** 27 Sep 2026  
**Target Launch:** 31 Dec 2026 (12 weeks)  

**Milestones:**
- Week 2: Database + auth ready
- Week 4: Backend API complete
- Week 6: Frontend pages (homepage, listing, detail)
- Week 8: Admin dashboard + email working
- Week 10: Callback form tested end-to-end
- Week 11: Full testing + security audit
- Week 12: Deploy + go live 🚀

---

## 16. CONTACT & ESCALATION

**Primary Contact:** Aariva Voyages Team  
**Email:** aarivavoyage@gmail.com  
**Phone:** +91 9035107020  

**Questions during development?**
1. Check this Memory.md file
2. Check PRD.md for context
3. Check Rules.md for how to do things
4. Message Aariva Voyages team

---

## 17. SUCCESS = THESE THREE THINGS

1. **Users land on homepage and understand instantly:** "Oh, I can explore packages and request a callback"
2. **Callback form converts 60%+:** Easy to fill, trustworthy, no friction
3. **Admin can manage callbacks easily:** See inquiries, contact details, follow up, track conversions

Everything else is secondary.

---

## 18. REMEMBER

**This is a lean startup project.** We're not building Expedia. We're building a lead-capture engine that:
- Shows packages beautifully
- Collects qualified inquiries
- Lets the team follow up

Simple. Effective. Fast.

---

*Bookmark this page. Return to it when confused. It's your north star.*

---

**Last Updated:** 27 Sep 2026  
**Next Review:** 31 Oct 2026
