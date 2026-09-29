# AARIYA VOYAGES - DEVELOPMENT RULES & PRINCIPLES

**Version:** 1.0  
**Last Updated:** September 27, 2026

---

## 1. CORE PRINCIPLES

### A. User-First
- Every feature is built for end-user benefit, not convenience
- Mobile experience is NOT an afterthought — mobile-first CSS
- Performance matters: <3s page load on 4G
- Accessibility: WCAG AA compliance minimum

### B. Simplicity Over Complexity
- One primary CTA per page (Request Callback)
- No unnecessary features or fancy animations
- Form fields: only collect what's needed for callback
- Copy is clear, conversational, not jargon-heavy

### C. Trust-Driven Design
- Visible reviews on every package (like Thrillophilia)
- Social proof: "Live X Travellers" badges
- Clear inclusions/exclusions (no hidden charges)
- Transparent pricing (GST included visible)
- Response time commitment visible ("We'll call in 2 hours")

### D. Data-Informed Decisions
- Track metrics: conversion rate, callback completion, bounce rate
- A/B test CTAs, form fields, package card layouts
- Adjust based on real user behavior, not guesses

---

## 2. CODING RULES

### A. Language & Syntax
- **JavaScript only** (no TypeScript in MVP)
- Use modern ES6+ (const/let, arrow functions, async/await)
- No var declarations (always const/let)
- Comments only for "why", never "what" the code does

**BAD:**
```js
// Loop through packages
packages.forEach(p => { ... })
```

**GOOD:**
```js
// Prioritize featured packages in carousel
featuredPackages.sort((a, b) => b.featured - a.featured)
```

### B. Naming Conventions
- **Components:** PascalCase (PackageCard.js, CallbackModal.js)
- **Functions/variables:** camelCase (getPackages, handleSubmit)
- **Constants:** UPPER_SNAKE_CASE (MAX_CALLBACKS_PER_HOUR)
- **Database tables:** snake_case (callback_requests, itinerary_days)
- **CSS classes:** kebab-case (callback-modal, package-grid)

**Examples:**
```js
// Component
export default function PackageCard({ package }) { }

// Function
const fetchPackageDetails = async (slug) => { }

// Constant
const MAX_FORM_SUBMISSIONS_PER_IP = 5

// Database
const { data } = await supabase.from('callback_requests').select()
```

### C. File Organization
```
aariya-voyages/
├── app/
│   ├── (auth)/
│   │   └── login/page.js
│   ├── admin/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── callbacks/page.js
│   │   └── packages/page.js
│   ├── packages/
│   │   ├── page.js (listing)
│   │   └── [slug]/page.js (detail)
│   ├── api/
│   │   ├── packages/route.js
│   │   ├── callback-requests/route.js
│   │   └── reviews/route.js
│   ├── layout.js (root)
│   ├── page.js (homepage)
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── packages/
│   │   ├── PackageCard.js
│   │   ├── PackageGrid.js
│   │   └── PackageFilters.js
│   ├── callback/
│   │   └── CallbackModal.js
│   ├── ui/
│   │   ├── Button.js
│   │   ├── Modal.js
│   │   └── Input.js
│   └── reviews/
│       └── ReviewCard.js
├── lib/
│   ├── supabase.js
│   ├── sendgrid.js
│   └── utils.js
├── public/
└── .env.local
```

### D. Import Order
```js
// 1. React/Next.js
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// 2. External libraries
import { createClient } from '@supabase/supabase-js'

// 3. Internal components
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'

// 4. Utils/lib
import { formatPrice } from '@/lib/utils'

// 5. Styles
import styles from './page.module.css'
```

---

## 3. GIT & VERSION CONTROL RULES

### A. Commit Messages
- Format: `type(scope): short description`
- Types: feat, fix, refactor, style, docs, chore
- Scope: feature area (e.g., callback, packages, admin)
- Keep messages under 50 chars

**Examples:**
```
feat(callback): add form validation
fix(packages): correct price display on mobile
refactor(api): split callback route handler
docs(readme): add setup instructions
chore: update dependencies
```

### B. Branch Naming
- Feature: `feat/callback-modal`
- Bug fix: `fix/package-image-loading`
- Refactor: `refactor/api-error-handling`

### C. PR Review Checklist
Before merging to main:
- [ ] Code follows naming conventions
- [ ] No console.log() left (except error logs)
- [ ] Responsive design tested (mobile + desktop)
- [ ] Accessibility: form labels, alt text, keyboard nav
- [ ] No unused imports or variables
- [ ] Database queries optimized (no N+1)
- [ ] Error handling in place
- [ ] Tests pass (if applicable)

---

## 4. PERFORMANCE RULES

### A. Page Load Targets
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

### B. Image Optimization
- Use Next.js Image component (automatic optimization)
- Provide width/height props
- Use blur placeholder: `placeholder="blur"`
- WebP format with JPEG fallback
- Image sizes: max 500KB after compression

### C. CSS & JavaScript
- No inline styles (use Tailwind classes)
- Lazy load components below the fold
- Minimize third-party scripts
- Tree-shake unused CSS in production

---

## 5. DATABASE RULES

### A. Query Safety
- **Always** use parameterized queries (never string concatenation)
- Use Supabase's client SDK (automatic escaping)
- Validate input on backend, not just frontend

**BAD:**
```js
// SQL injection risk
const result = await supabase.from('packages')
  .select(`* WHERE id = '${packageId}'`)
```

**GOOD:**
```js
// Safe: parameterized
const { data } = await supabase.from('packages')
  .select()
  .eq('id', packageId)
```

### B. Data Integrity
- Use NOT NULL constraints for required fields
- Add CHECK constraints for enums (status, category)
- Use foreign keys for relationships
- Implement soft deletes if needed (is_deleted flag)

### C. Performance
- Index frequently filtered columns (is_featured, category, status)
- Limit returned fields (don't SELECT *)
- Use pagination (offset/limit) for large datasets
- Denormalize if query performance needs it (live_traveler_count on package)

---

## 6. SECURITY RULES

### A. Authentication
- All admin routes require Supabase Auth
- Use session tokens, not API keys in frontend
- Refresh tokens automatically
- Logout clears all auth state

### B. Data Protection
- HTTPS everywhere (automatic on Vercel)
- Sanitize user input (DOMPurify for rich text)
- Rate limit: max 5 callback requests per IP per hour
- Hash passwords (Supabase handles this)

### C. Sensitive Data
- Never commit .env files to GitHub
- Use environment variables for API keys
- Don't log sensitive data (phone numbers, emails in console)
- Encrypt PII at rest if storing (not MVP)

### D. CORS & CSP
- Allow CORS only for necessary domains
- Set Content Security Policy headers
- Restrict external scripts

---

## 7. API RULES

### A. REST Conventions
- GET: fetch data (no side effects)
- POST: create new resource
- PUT/PATCH: update resource
- DELETE: remove resource

### B. Response Format
All responses must follow this structure:
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Optional success message"
}
```

Error response:
```json
{
  "success": false,
  "error": "Error message for user",
  "code": "ERROR_CODE"
}
```

### C. Status Codes
- 200: Success
- 201: Created
- 400: Bad request (validation error)
- 401: Unauthorized (auth required)
- 403: Forbidden (auth failed)
- 404: Not found
- 429: Too many requests (rate limited)
- 500: Server error

---

## 8. TESTING RULES

### A. Minimum Testing
- Homepage loads without errors
- Package cards render correctly
- Callback form validates input
- API routes return correct status codes
- Mobile responsiveness (320px, 768px, 1024px)

### B. User Testing
- Test callback form submission end-to-end
- Verify email delivery (check spam folder)
- Test on real devices (iPhone, Android)
- Check form on slow 4G connection

---

## 9. ACCESSIBILITY (A11Y) RULES

### A. Visual
- Color contrast: WCAG AA (4.5:1 for text)
- Font size: minimum 16px on mobile
- Touch targets: minimum 44px × 44px
- Don't rely on color alone (use icons + text)

### B. Semantic HTML
```html
<!-- GOOD -->
<form>
  <label htmlFor="name">Full Name</label>
  <input id="name" type="text" />
  <button type="submit">Submit</button>
</form>

<!-- BAD -->
<div>
  <span>Full Name</span>
  <input />
  <div onClick={...}>Submit</div>
</div>
```

### C. Keyboard Navigation
- Tab through form in logical order
- Buttons and links accessible via Enter key
- No keyboard traps (user can't escape)
- Focus visible (outline or indicator)

### D. Screen Readers
- Use semantic HTML (buttons, links, forms)
- Add alt text to images: `alt="Sikkim mountain landscape"`
- Use aria-label for icon buttons
- Test with screen reader (NVDA, JAWS, VoiceOver)

---

## 10. DEPLOYMENT RULES

### A. Pre-Deployment Checklist
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Environment variables set in deployment platform
- [ ] Database migrations run
- [ ] Security audit completed
- [ ] Staging environment tested
- [ ] SEO meta tags verified
- [ ] Performance metrics checked

### B. Staging vs Production
- Deploy to staging first (test.aarivavoyages.com)
- Use staging database for testing
- Never test in production
- Keep staging env variables separate

### C. Rollback Plan
- Keep previous version deployable
- Monitor error rate after deploy
- If > 5% errors, rollback immediately
- Post-mortem on failures

---

## 11. DOCUMENTATION RULES

### A. Code Comments
- Only explain "why", not "what"
- Keep comments current (delete outdated ones)
- Use JSDoc for complex functions

```js
/**
 * Fetch packages by category and price range
 * Filters by feeling_tags for homepage carousel
 * 
 * @param {string} category - package category
 * @param {number} minPrice - minimum price per person
 * @param {number} maxPrice - maximum price per person
 * @returns {Promise<Array>} array of packages
 */
const fetchPackages = async (category, minPrice, maxPrice) => {
  // Query logic
}
```

### B. README
- Setup instructions (clone, install, env vars)
- How to run locally
- How to deploy
- Common issues & solutions

### C. API Documentation
- Endpoint URL, method, auth required
- Request body example
- Response body example
- Error codes and meanings

---

## 12. WHAT NOT TO DO

❌ Don't commit:
- node_modules/
- .env files
- API keys or secrets
- Large build artifacts

❌ Don't use:
- var keyword
- == instead of ===
- eval() or innerHTML for user content
- Synchronous file operations
- Magic numbers without constants

❌ Don't skip:
- Mobile testing
- Accessibility checks
- Error handling
- Input validation
- Database indexes

---

**Questions?** Refer to this document or ask in team Slack.  
**Updates?** Submit a PR to update this file.

---

*Last Updated: 27 Sep 2026*
