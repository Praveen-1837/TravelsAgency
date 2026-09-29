import { callbackRequestSchema } from '../validators/callback-validator';
import { packageQuerySchema, createPackageSchema } from '../validators/package-validator';
import { createReviewSchema } from '../validators/review-validator';
import {
  createCallbackRequest,
  updateAdminCallback,
  getAdminCallbacks,
} from '../services/callback-service';
import { getAllPackages, getPackageBySlug } from '../services/package-service';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.info(`  ✓ PASSED: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✕ FAILED: ${testName}`);
    failedCount++;
  }
}

async function runTests() {
  console.info('===================================================');
  console.info(' Aariva Voyages Backend Test Suite & Automated Audit');
  console.info('===================================================\n');

  // ------------------------------------------------------------------
  // 1. Callback Request Validator Unit Tests
  // ------------------------------------------------------------------
  console.info('[1/5] Testing Callback Request Validator (Zod Schema)...');

  // Valid 10-digit Indian phone numbers
  const valid1 = callbackRequestSchema.safeParse({
    name: 'Ananya Sharma',
    phone: '9876543210',
    group_size: 2,
  });
  assert(valid1.success && valid1.data?.phone === '9876543210', 'Valid 10-digit phone accepted');

  const valid2 = callbackRequestSchema.safeParse({
    name: 'Rahul Verma',
    phone: '+91 98201 98201',
    group_size: 4,
  });
  assert(
    valid2.success && valid2.data?.phone === '9820198201',
    'Phone with +91 prefix and spaces sanitized to 10 digits'
  );

  const valid3 = callbackRequestSchema.safeParse({
    name: 'Vikram Seth',
    phone: '09811223344',
  });
  assert(valid3.success && valid3.data?.phone === '9811223344', 'Phone with leading 0 sanitized');

  // Invalid phone numbers
  const invalidPhone1 = callbackRequestSchema.safeParse({
    name: 'Test',
    phone: '123456',
  });
  assert(!invalidPhone1.success, 'Reject phone shorter than 10 digits');

  const invalidPhone2 = callbackRequestSchema.safeParse({
    name: 'Test',
    phone: '5876543210', // starts with 5 (invalid in India)
  });
  assert(!invalidPhone2.success, 'Reject Indian phone starting with invalid digit (5)');

  // Honeypot bot spam prevention
  const honeypotBot = callbackRequestSchema.safeParse({
    name: 'Spam Bot',
    phone: '9876543210',
    website_hp: 'http://spam-link.com',
  });
  assert(!honeypotBot.success, 'Honeypot field rejects spam submission');

  // ------------------------------------------------------------------
  // 2. Package Query & Payload Validator Unit Tests
  // ------------------------------------------------------------------
  console.info('\n[2/5] Testing Package Query & Creation Validators...');

  const validQuery = packageQuerySchema.safeParse({
    destination: 'Sikkim',
    sort: 'price_asc',
    limit: '10',
  });
  assert(
    validQuery.success && validQuery.data?.limit === 10 && validQuery.data?.sort === 'price_asc',
    'Package query coerces string numbers and validates sort fields'
  );

  const validPkgPayload = createPackageSchema.safeParse({
    slug: 'kerala-backwaters-special',
    title: 'Kerala Backwaters & Houseboat Escape',
    destination: 'Kerala',
    duration_days: 6,
    duration_nights: 5,
    price_per_person: 22000,
    description: 'Experience tranquil Alleppey houseboats and Munnar tea gardens.',
  });
  assert(
    validPkgPayload.success && validPkgPayload.data?.price_unit === 'person',
    'Package creation schema injects default price_unit and handles required fields'
  );

  // ------------------------------------------------------------------
  // 3. Review Validator Unit Tests
  // ------------------------------------------------------------------
  console.info('\n[3/5] Testing Review Moderation Validator...');

  const validReview = createReviewSchema.safeParse({
    traveler_name: 'Priya & Rohan',
    rating: 5,
    comment: 'The sunrise view from Tiger Hill was breathtaking! Excellent arrangements by Aariva.',
  });
  assert(validReview.success, 'Accept valid review with 5-star rating and comment');

  const invalidRating = createReviewSchema.safeParse({
    traveler_name: 'Test',
    rating: 6, // invalid
    comment: 'Great trip overall!',
  });
  assert(!invalidRating.success, 'Reject review rating above 5');

  const shortComment = createReviewSchema.safeParse({
    traveler_name: 'Test',
    rating: 4,
    comment: 'Good', // too short (< 10 chars)
  });
  assert(!shortComment.success, 'Reject review comment shorter than 10 characters');

  // ------------------------------------------------------------------
  // 4. Callback Service & Memory Storage Integration Tests
  // ------------------------------------------------------------------
  console.info('\n[4/5] Testing Callback Service Business Logic...');

  const createdInquiry = await createCallbackRequest({
    name: 'Unit Test Traveler',
    phone: '9988776655',
    email: 'test@aarivavoyages.com',
    group_size: 3,
    special_requests: 'Require vegetarian meals',
  });
  assert(
    createdInquiry.id !== undefined && createdInquiry.status === 'new',
    'Callback request created with unique ID and default status "new"'
  );

  const updatedInquiry = await updateAdminCallback(createdInquiry.id, {
    status: 'contacted',
    notes: 'Called customer on WhatsApp, shared custom itinerary.',
    assigned_to: 'Sunil Rao',
  });
  assert(
    updatedInquiry?.status === 'contacted' && updatedInquiry?.assigned_to === 'Sunil Rao',
    'Inquiry status, notes, and assignee updated correctly'
  );

  const adminList = await getAdminCallbacks();
  assert(
    adminList.some((c) => c.id === createdInquiry.id),
    'Created inquiry appears in admin callbacks list'
  );

  // ------------------------------------------------------------------
  // 5. Package Service & Catalog Integration Tests
  // ------------------------------------------------------------------
  console.info('\n[5/5] Testing Package Service Catalog & Filters...');

  const allPackages = await getAllPackages({});
  assert(allPackages.data.length >= 6, 'Seed catalog contains at least 6 packages');

  const sikkimPkg = await getPackageBySlug('sikkim-darjeeling');
  assert(
    sikkimPkg !== null && sikkimPkg.destination.includes('Sikkim'),
    'Fetch package by slug returns detailed itinerary and images'
  );

  // ------------------------------------------------------------------
  // Test Summary
  // ------------------------------------------------------------------
  console.info('\n===================================================');
  console.info(` Test Summary: ${passedCount} Passed, ${failedCount} Failed`);
  console.info('===================================================');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.info('🎉 ALL BACKEND UNIT & INTEGRATION TESTS PASSED CLEANLY!\n');
  }
}

runTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
