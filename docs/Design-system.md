# Aariva Voyages — Design System

**Source of truth:** the Figma file "Travel agency" (5 frames: Home, Tour Details, Listing, Mobile Itinerary, Checkout). Values below were read directly from that file. The Figma sample content is branded "ThrillVibe" and shows international trips (Bali, Dubai); in the build, the brand is **Aariva Voyages** and the packages are the six domestic ones in TechSpec.md. Layout, colors, type and components stay as designed.

## 1. Design Frames
| Frame | Size | Build as |
|---|---|---|
| Explore & Discovery (Home) | 1280 × 3402 | `/` |
| Ladakh Tour Details | 1280 × 4391 | `/packages/[slug]` (desktop) |
| Bali Packages Listing | 1280 × 2127 | `/packages` |
| Tour Itinerary & Details (mobile) | 390 × 3070 | `/packages/[slug]` (mobile) |
| Secure Checkout | 1280 × 2550 | **Phase 2** (see section 10) |

## 2. Principles
- Bold, image-led, adventure feel with a confident orange call to action.
- Clean white cards on a soft grey page; small radius language (8 / 12 px).
- Trust signals everywhere: ratings, review counts, verified badges, "Instant Confirmation", helpline.
- Honeymoon and group/family packages get equal prominence.
- Mobile-first behavior for the 1280 desktop layouts.

## 3. Colors (from Figma)
| Token | Hex | Use |
|---|---|---|
| `--color-cta` | #FF5722 | Primary buttons, prices, discount badges, key highlights |
| `--color-cta-deep` | #B02F00 | Orange text/links on light backgrounds, section eyebrows, INR toggle active |
| `--color-success` | #006C49 | "Instant Confirmation" badge, "Explorer Tier", eyebrow accents, verified/free items |
| `--color-success-bright` | #00A572 | Positive icons and highlights |
| `--color-amber` | #F59E0B | Star ratings, sale accents |
| `--color-amber-deep` | #78350F | Text on amber badges |
| `--color-ink` | #191C1E | Headings, primary text |
| `--color-body` | #5B4039 | Body text, list text (warm brown) |
| `--color-slate` | #565E74 | Secondary text, labels, captions |
| `--color-dark` | #2D3133 | Dark buttons ("View Details"), dark badges ("BESTSELLER") |
| `--color-bg` | #F7F9FB | Page background |
| `--color-surface` | #FFFFFF | Cards, inputs, header |
| `--color-surface-2` | #F2F4F6 | Search field grid, footer, info boxes |
| `--color-surface-3` | #ECEEF0 | Price summary box, chips |
| `--color-line` | #E0E3E5 | Pills, dividers |
| `--color-blush` | #FFDBD1 / #E4BEB4 | Soft orange tint, separators (•) |
| `--color-periwinkle` | #DAE2FD | Info chips |
| `--color-error` | #BA1A1A / #93000A | Errors; discount label text on light |
| Hero text on dark | #FFFFFF, #F2F4F6, #FFB5A0 (accent) | Text over image overlays |

Usage rules:
- One dominant action color: **#FF5722** for buttons and prices.
- Use **#B02F00** (about 6.5:1 on white) for orange *text* on light backgrounds.
- Green is only for trust/confirmation states, never for buttons.
- Star ratings use amber.

## 4. Typography
**Font family: Plus Jakarta Sans** (Google Fonts) with a system-font fallback. Weights: Regular 400, Medium 500, SemiBold 600, Bold 700, ExtraBold 800.

| Style | Size | Weight | Use |
|---|---|---|---|
| Hero H1 | 56 | ExtraBold | Home hero, listing hero |
| Section H2 | 40 | Bold | Section titles ("Trending Adventure Destinations") |
| Detail title | 40 | Bold | Tour detail heading |
| Sub-section | 22 | Bold / SemiBold | "Expedition Highlights", "Day-by-Day Plan" |
| Price (large) | 40 (detail) / 22 (card) | ExtraBold | Prices in #FF5722 |
| Card title | 18 | SemiBold / Bold | Package titles |
| Lead paragraph | 18 | Regular | Hero subtitle |
| Body | 15 | Regular | Section descriptions, itinerary text |
| UI text | 13 | Regular / Medium / SemiBold | Nav, meta, list items, buttons |
| Eyebrow / label | 10–11 | Bold, uppercase, letter-spaced | "CURATED HUBS", "WHERE TO?", badges |
| Mobile title | 24 | Bold | Mobile detail title |

## 5. Layout & Spacing
- Desktop frame 1280; content container **1216** (32px side padding).
- 12-column grid. Listing: filter sidebar **~286px (3 cols)** + results **~906px (9 cols)**.
- Card grid: **3 columns**, card 389 × 480, gap ~24.
- Spacing scale: 2 · 4 · 6 · 8 · 12 · 16 · 24 · 32. Most common gaps: 4, 8, 16, 24.
- Mobile frame 390; single column, 16px side padding.
- Breakpoints: mobile <640, tablet 640–1024, desktop >1024.

## 6. Radius & Elevation
- Radius: **4** (small badges), **6** (discount badge), **8** (buttons, inputs), **12** (cards, search widget, sidebar), **full/9999** (pills, chips, avatars).
- Elevation: very subtle shadow on cards (`0 1px 2px rgba(0,0,0,.08)`); buttons on cards get the same; the big sticky CTA uses `0 4px 16px rgba(255,87,34,.25)`.

## 7. Components

### Header (all pages)
1. **Top utility bar:** promo text ("SUMMER TREKS 20% OFF"), currency toggle (INR ₹ active in #B02F00 / USD $), "24x7 Helpline" with number, notification badge, user chip with tier label.
2. **Main bar:** logo (brand name 18 SemiBold + small tagline "EXPERIENCES & TOURS"), category links, search field ("Search destinations, activities, treks..."), Destinations mega-link.
3. **Sub-nav:** Destinations · Treks & Expeditions · Staycations · Gift an Experience · Community; active item in #B02F00 Bold.
4. **Breadcrumb** on inner pages (Home > Treks > Ladakh > Package).
- Mobile: condensed bar with back arrow + page title; hamburger drawer.

### Hero + Search widget (Home)
- Full-width hero image (height ~567) with dark overlay, trust pill ("OVER 3,000,000+ JOURNEYS CRAFTED WORLDWIDE"), H1 56 ExtraBold white, 18px subtitle.
- **Tabbed search widget** (1024 × 160, white, radius 12): tabs (Tours & Treks, International Escapes, Weekend Getaways, Activities & Water Sports), field grid on #F2F4F6 with labels WHERE TO? · TRAVEL DATES · DURATION, and a **Search** button (#FF5722, 239 × 56, radius 8, 18 Bold white).
- "POPULAR:" quick-link chips below.

### Flash-sale banner
Dark banner with FLASH SALE tag, headline 22 SemiBold, countdown (DAYS · HOURS · MINS), coupon code, and a #FF5722 "Claim Deal" button (100 × 36).

### Destination card (Trending grid)
Tall image card with gradient overlay: "45K+ THRILL SEEKERS BOOKED" pill, destination name 30 Bold white, sub-line 13, "STARTING FROM" + price 18 Bold, rating chip.

### Package card (389 × 480, white, radius 12)
- Image 240px tall; top-left dark badge (BESTSELLER / LIKELY TO SELL OUT / TOP RATED); duration bar overlay ("6 Days / 5 Nights"); green "Instant Confirmation" badge.
- Meta row: **★ 4.8 (1,920 reviews) • Location**.
- Title 18 SemiBold (2 lines).
- Inclusion chips: stay, transport, meals.
- Footer: strike-through old price (13 Medium slate), **discount label** (e.g. "22% OFF", 10 Bold #93000A), **price 22 ExtraBold #FF5722** with "/ person", and dark **View Details** button (111 × 40, #2D3133, radius 8).

### Listing card (horizontal, 906 × 198)
Image left (~346), middle content (title 18 Bold, location + category tags, feature chips such as "Free Hotel Transfer"), right column: "STARTING FROM", strike price, price 22 Bold, "per person / all taxes incl.", rating + count, **primary button** (#FF5722) and secondary "View Details".

### Filter sidebar (286 wide, white, radius 12)
Title "Filters" + RESET ALL; Price range slider (₹1,000 – ₹50,000+); Duration (radio list); Tour Style & Category (checkbox list); Essential Inclusions. Category tabs above results: All Packages (148) · Day Tours · Water Sports · Island Trips; "Sort by: Popularity" dropdown on the right.

### Buttons
| Type | Style |
|---|---|
| Primary | #FF5722, white text 13–18 Bold, radius 8, height 40 (card) / 56 (hero) / 54 (sticky CTA) |
| Dark | #2D3133, white text, radius 8, height 40 |
| Pill / ghost | #E0E3E5 bg, radius full ("Call Guide", "EXPAND ALL") |
| Text link | #B02F00 SemiBold ("View all 80+ destinations") |

### Badges
BESTSELLER / POPULAR (dark #2D3133, radius 4) · discount "% OFF" (#FF5722 bg, white, radius 6) · Instant Confirmation (#006C49 bg, white, radius 4) · Verified Supplier · "Selling Fast".

### Tour Detail page (desktop)
- Breadcrumb; badge row (BESTSELLER · 6 Days / 5 Nights · Verified Supplier · 8.4k Booked); H1 40 Bold; rating + location + difficulty ("Moderate Altitude Expedition").
- **Gallery** (large + 3 tiles, "24+ Photos", VIEW FULL GALLERY).
- **Two-column body:** left content, right **sticky booking card** (389 wide, white, radius 12): old price, discount, price 40 ExtraBold #FF5722 "/ per adult", tax note, deposit note, date selector, traveler stepper, add-ons (checkbox cards with price), price summary box (#ECEEF0), big orange CTA, urgency line ("Only 4 departure seats remaining"), trust list (Free Cancellation · 100% Safe Payments · 24x7 Trip Marshal), "Have Questions?" box with Call Guide pill.
- Sections: Expedition Highlights (2×2 cards), Route Altitude Profile (chart), **Day-by-Day Plan** (accordion with EXPAND ALL, each day shows altitude, stay, meals), Inclusions / Exclusions tabs, Travel Advisory cards, Reviews.

### Mobile Tour Details (390)
Top bar with back + title, image carousel (1/4 counter), badges, title 24 Bold, rating row, chips (Mountain Trek · Small Group · Meals Included · Free Cancellation), price block, itinerary accordion cards (DAY n • LOCATION eyebrow + title 18 Bold), Package Details tabs (Inclusions / Exclusions), Essential Travel Advisory cards, **sticky bottom CTA bar**.

### Reviews ("Verified Traveler Stories")
Section eyebrow "FROM OUR COMMUNITY", overall rating "4.8 / 5.0 (94,200+ Reviews)", photo review cards with trip label overlay ("Ladakh Roadtrip").

### Why Choose Us
Four icon columns: 3M+ Happy Travelers · Best Price Guarantee · 24x7 On-Trip Support · 100% Verified Guides (title 18 Bold, text 13 slate).

### Footer
Background #F2F4F6, four link columns, brand block, contact and social links.

## 8. Iconography & Imagery
- Line icons, 16–24px, single color (ink or slate).
- Full-bleed destination photography with dark gradient overlay for text legibility.
- Images: WebP, lazy loaded, `alt` text on all.

## 9. Adapting the Design for Aariva Voyages (Phase 1: callback model)
| Figma element | Aariva Voyages build |
|---|---|
| Brand "ThrillVibe" | **Aariva Voyages** (logo, title, footer, emails) |
| "Book Now" / "Proceed to Booking" | **"Request Callback"** (same #FF5722 style) |
| "Instant Confirmation" badge | "Free Callback" or "Expert Assisted" (keep the green badge style) |
| Deposit note ("Book with ₹2,000") | "Talk to our travel expert, no payment needed" |
| Date selector + traveler stepper | Kept, and sent with the callback form |
| Price summary box | Kept as "Estimated price"; final quote given on the call |
| International samples (Bali, Dubai) | Domestic packages: Sikkim-Darjeeling, Assam-Meghalaya, Andaman, Lakshadweep, Kashmir Couple Special, Andaman Luxury Honeymoon |
| Currency toggle INR/USD | Keep INR only (hide toggle) unless international is added |
| Explorer Tier / user chip | Hidden until user accounts exist |
| Helpline + "24x7" | Use the real Aariva Voyages phone/WhatsApp number |
| Statistics (3M+, 94,200+ reviews, 45K+ booked) | Replace with real numbers; do not launch with these placeholders |

## 10. Checkout Frame (Phase 2)
The "Secure Checkout" frame (4-step flow: Select Tour → Traveler Details → Review & Add-ons → Secure Payment; form with name, email, mobile, state; order summary card; encrypted-session timer) is kept as the **Phase 2 reference** for Razorpay checkout. In Phase 1 only the Traveler Details form pattern is reused, inside the callback form.

## 11. Accessibility Notes
- **#FF5722 with white text is about 3.2:1**, below WCAG AA for small text. Keep it for large/bold text (16px+ Bold) and buttons at 16px+, and use **#B02F00** for orange text on light backgrounds. If AA is required for smaller button labels, darken the button to about #D84315 or use 16–18px bold labels.
- Increase the smallest text (10–11px eyebrows/badges) to at least 11–12px on mobile.
- Touch targets at least 44px; visible focus rings (2px #FF5722 offset); keyboard-navigable accordion and tabs.
- Respect `prefers-reduced-motion`; provide `alt` for all photos.

## 12. CSS Tokens (starter)
```css
:root {
  --color-cta: #FF5722;  --color-cta-deep: #B02F00;
  --color-success: #006C49; --color-amber: #F59E0B;
  --color-ink: #191C1E; --color-body: #5B4039; --color-slate: #565E74;
  --color-dark: #2D3133;
  --color-bg: #F7F9FB; --color-surface: #FFFFFF;
  --color-surface-2: #F2F4F6; --color-surface-3: #ECEEF0; --color-line: #E0E3E5;
  --color-error: #BA1A1A;
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-full: 9999px;
  --shadow-card: 0 1px 2px rgba(0,0,0,.08);
  --container: 1216px;
}
```
