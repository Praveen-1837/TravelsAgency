# Aariva Voyages — App Flow

## 1. Sitemap
- Home
- Packages (listing with filters)
  - Package Detail (Overview | Itinerary | Reviews | Inclusions)
- Honeymoon / Group & Family collections
- About / Contact
- Admin (login, dashboard, inquiries, packages, reviews)

## 2. Primary Visitor Flow: Request a Callback
```
Home / Search
   -> Packages list (filter: destination, budget, duration, honeymoon / group)
   -> Package card (image, price, "4.7 • 128 reviews")
   -> Package detail (itinerary, inclusions, traveler reviews & photos)
   -> "Request Callback" button (sticky on mobile)
   -> Form: phone, email, travel dates, group size, special requests
   -> Submit -> Confirmation message ("Our team will call you shortly")
   -> Aariva team notified (email + admin dashboard)
   -> WhatsApp / phone callback
```

## 4. Page Flows
### Home
Hero with headline and search, featured packages, honeymoon and group/family sections side by side, testimonials, trust signals, newsletter signup, Request Callback CTA.

### Package Listing
Filter bar (collapsible on mobile), sort by price / rating / duration, 3-column card grid on desktop (1–2 on smaller screens), lazy-loaded images.

### Package Detail
Gallery, tabbed content, sticky "Request Callback" button, review carousel with traveler photos, similar packages.

### Callback Form
Modal or dedicated page. Validation: phone required (10-digit Indian mobile), email valid, dates optional range, group size numeric. Success and error states shown inline.

## 5. Admin Flow
```
Login (Supabase Auth)
   -> Dashboard (new requests count, conversion stats)
   -> Callback Requests list (filter by status / package / date)
   -> Open request -> view details -> call / WhatsApp customer
   -> Update status: New -> Contacted -> Converted / Closed, add notes
   -> Manage Packages (create, edit, price, images, activate/deactivate)
   -> Manage Reviews (add manually, approve, feature)
```

## 6. Review Collection Flow (Phase 1: manual)
Trip completed -> team requests review from customer (WhatsApp) -> admin enters rating, comment, photos -> approved -> shown on package card and detail page; rating average and count update automatically.

## 7. Notifications
| Event | Recipient | Channel |
|---|---|---|
| New callback request | Aariva team | Email + dashboard |
| Request received | Customer | Confirmation email |
| Status change | Internal only | Dashboard |

## 8. Edge Cases
- Duplicate submission: throttle and merge by phone + package within 24 hours.
- Inactive package: hide from listing; detail URL shows a "no longer available" message with alternatives.
- Email failure: request is still saved; retry queued.
