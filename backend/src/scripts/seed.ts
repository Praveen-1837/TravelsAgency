import dotenv from 'dotenv';
import { supabaseAdmin } from '../services/supabase-service';
import { SEED_PACKAGES } from '../services/package-service';

dotenv.config();

const DEMO_REVIEWS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    package_id: '11111111-1111-1111-1111-111111111111',
    traveler_name: 'Rohan & Sneha Kulkarni',
    rating: 5,
    comment:
      'Our Sikkim trip was flawlessly managed by Aariva Voyages. The sunrise from Tiger Hill with hot Darjeeling tea was breathtaking. Our driver was extremely polite and the mountain road permits were handled in advance!',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    ],
    trip_label: 'Family Vacation (Pune)',
    is_approved: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    package_id: '55555555-5555-5555-5555-555555555555',
    traveler_name: 'Aditya & Meera Singhania',
    rating: 5,
    comment:
      'The Dal Lake houseboat experience and candlelight dinner was magical. Gondola Phase 2 had fresh snow. The Aariva coordinator followed up everyday to ensure everything was on schedule.',
    photos: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
    ],
    trip_label: 'Honeymoon Special (Delhi)',
    is_approved: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    package_id: '33333333-3333-3333-3333-333333333333',
    traveler_name: 'Vikram & Divya Nair',
    rating: 5,
    comment:
      'Radhanagar Beach was as stunning as promised. We enjoyed the catamaran ferry to Havelock and our snorkeling session at Elephant Beach was included without hassle. 10/10 recommend Aariva!',
    photos: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=600&q=80',
    ],
    trip_label: 'Couple Getaway (Bengaluru)',
    is_approved: true,
  },
];

async function runSeed() {
  console.info('🌱 [Seed] Starting Aariva Voyages database seeding...');

  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('⚠️  [Seed] Supabase URL is not configured or using placeholder in .env.');
    console.info(
      '💡 [Seed] SQL migrations and seeds are ready at: supabase/migrations/ and supabase/seed.sql.'
    );
    console.info(
      '💡 [Seed] Once live Supabase credentials are added to backend/.env, rerun: npm run db:seed'
    );
    return;
  }

  try {
    // 1. Seed Packages
    console.info(`📦 [Seed] Seeding ${SEED_PACKAGES.length} launch domestic packages...`);
    for (const pkg of SEED_PACKAGES) {
      const { error } = await supabaseAdmin.from('packages').upsert({
        id: pkg.id,
        slug: pkg.slug,
        title: pkg.title,
        destination: pkg.destination,
        duration_days: pkg.duration_days,
        duration_nights: pkg.duration_nights,
        duration: pkg.duration,
        price_per_person: pkg.price_per_person,
        original_price: pkg.original_price,
        discount_percent: pkg.discount_percent,
        price_unit: pkg.price_unit,
        audience: pkg.audience,
        description: pkg.description,
        inclusions: pkg.inclusions,
        itinerary: pkg.itinerary,
        images: pkg.images,
        rating_avg: pkg.rating_avg,
        review_count: pkg.review_count,
        is_featured: pkg.is_featured,
        is_active: pkg.is_active,
      });

      if (error) {
        console.error(`❌ [Seed] Failed to upsert package ${pkg.slug}:`, error.message);
      } else {
        console.info(`  ✓ Seeded package: ${pkg.title} (₹${pkg.price_per_person})`);
      }
    }

    // 2. Seed Demo Reviews
    console.info('⭐ [Seed] Seeding removable demo reviews...');
    for (const review of DEMO_REVIEWS) {
      const { error } = await supabaseAdmin.from('reviews').upsert(review);
      if (error) {
        console.error(
          `❌ [Seed] Failed to upsert review for ${review.traveler_name}:`,
          error.message
        );
      } else {
        console.info(`  ✓ Seeded review: ${review.traveler_name} (${review.rating}★)`);
      }
    }

    console.info('🎉 [Seed] Seeding completed successfully!');
  } catch (err) {
    console.error('❌ [Seed] Unexpected seeding error:', err);
  }
}

runSeed();
