import { Package, Review } from './types';

export const LOCAL_SEED_PACKAGES: Package[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    slug: 'sikkim-darjeeling',
    title: 'Sikkim & Darjeeling Himalayan Escapade',
    destination: 'Sikkim-Darjeeling',
    duration_days: 7,
    duration_nights: 6,
    duration: '6N/7D',
    price_per_person: 11300,
    original_price: 14500,
    discount_percent: 22,
    price_unit: 'person',
    audience: ['group', 'family', 'couple'],
    description:
      'Immerse yourself in the tranquility of the Eastern Himalayas. Watch the sunrise over Mt. Kanchenjunga from Tiger Hill, wander through aromatic Darjeeling tea gardens, visit peaceful Buddhist monasteries in Gangtok, and explore the crystal-clear waters of Tsomgo Lake at 12,400 ft.',
    inclusions: [
      '6 Nights accommodation in premium 3-star view hotels',
      'Daily delicious breakfast and dinner included',
      'Private dedicated SUV transfers throughout the tour',
      'Tsomgo Lake & Baba Mandir permit assistance',
      'Toy Train joy ride assistance in Darjeeling',
      '24x7 local on-trip marshal and support',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival at Bagdogra / NJP & Scenic Drive to Gangtok',
        stay: 'Gangtok View Resort',
        meals: 'Dinner',
        description:
          'Meet your private Aariva chauffeur at Bagdogra Airport or NJP station. Embark on a breathtaking drive along the Teesta River climbing into Sikkim. Check in, relax, and stroll MG Marg in the evening.',
        highlights: ['Teesta Valley views', 'Evening stroll at MG Marg', 'Welcome dinner'],
      },
      {
        day: 2,
        title: 'Excursion to Glacial Tsomgo Lake & Baba Harbhajan Mandir',
        altitude: '12,400 ft',
        stay: 'Gangtok View Resort',
        meals: 'Breakfast & Dinner',
        description:
          'Ascend through high-altitude misty mountain roads to the sacred Tsomgo Lake. Witness pristine alpine reflections, ride friendly yaks, and pay homage at the legendary Baba Mandir.',
        highlights: ['Sacred glacial lake', 'Yak ride opportunity', 'Alpine terrain'],
      },
      {
        day: 3,
        title: 'Gangtok Local Sights & Drive to Queen of Hills, Darjeeling',
        stay: 'Darjeeling Colonial Retreat',
        meals: 'Breakfast & Dinner',
        description:
          'Visit Do Drul Chorten Stupa and the Namgyal Institute of Tibetology. After lunch, enjoy a picturesque drive winding through pine forests and misty emerald slopes into Darjeeling.',
        highlights: ['Tibetan architecture', 'Pine forest drive', 'Darjeeling Mall Road'],
      },
      {
        day: 4,
        title: 'Tiger Hill Sunrise, Ghoom Monastery & Tea Gardens',
        stay: 'Darjeeling Colonial Retreat',
        meals: 'Breakfast & Dinner',
        description:
          'Early morning 4:00 AM ascent to Tiger Hill to watch the golden sunrise illuminate Kanchenjunga. Visit historical Ghoom Monastery, Batasia Loop memorial, and Happy Valley Tea Estate.',
        highlights: [
          'Iconic Tiger Hill sunrise',
          'Batasia Loop spirals',
          'World-famous tea tasting',
        ],
      },
      {
        day: 5,
        title: 'Mirik Lake Leisure & Pashupati Nepal Border Crossing',
        stay: 'Darjeeling Colonial Retreat',
        meals: 'Breakfast & Dinner',
        description:
          'Excursion to peaceful Sumendu Lake (Mirik). Boating amidst Japanese cedars and explore the border market for regional handicrafts and souvenirs.',
        highlights: ['Mirik Lake boating', 'Cardamom plantations', 'Border crafts shopping'],
      },
      {
        day: 6,
        title: 'Heritage Walk, Peace Pagoda & Himalayan Mountaineering Institute',
        stay: 'Darjeeling Colonial Retreat',
        meals: 'Breakfast & Dinner',
        description:
          'Discover Japanese Peace Pagoda, HMI museum showcasing Everest expeditions, and the Padmaja Naidu Himalayan Zoological Park home to Red Pandas and Snow Leopards.',
        highlights: ['Red Panda spotting', 'HMI climbing exhibits', 'Peace Pagoda sunset'],
      },
      {
        day: 7,
        title: 'Farewell Himalayas & Transfer to Bagdogra / NJP',
        meals: 'Breakfast',
        description:
          'Savor one last authentic cup of Darjeeling tea with panoramic valley views before our chauffeur drops you at Bagdogra or NJP with cherished memories.',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
    ],
    rating_avg: 4.8,
    review_count: 142,
    is_featured: true,
    is_active: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    slug: 'assam-meghalaya',
    title: 'Assam & Meghalaya: The Abode of Clouds & Living Root Bridges',
    destination: 'Assam-Meghalaya',
    duration_days: 6,
    duration_nights: 5,
    duration: '5N/6D',
    price_per_person: 15800,
    original_price: 19800,
    discount_percent: 20,
    price_unit: 'person',
    audience: ['group', 'family', 'couple'],
    description:
      'Explore magical Northeast India: navigate the crystal clear waters of Umngot River at Dawki, trek to centuries-old UNESCO-candidate Living Root Bridges in Cherrapunji, witness Asia’s cleanest village at Mawlynnong, and look out for One-Horned Rhinoceroses in Kaziranga.',
    inclusions: [
      '5 Nights stays in scenic eco-resorts & boutique hotels',
      'Breakfast and dinner included everyday',
      'Private AC vehicle for all transfers and sightseeing',
      'Permits, parking, and toll taxes included',
      'Dawki country boat ride experience included',
      '24x7 personal trip coordinator assistance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Guwahati Arrival to the Scottish Highlands of the East: Shillong',
        stay: 'Shillong Pine Resort',
        meals: 'Dinner',
        description:
          'Arrive at Guwahati Airport and head toward Shillong. Stop by the majestic Umiam Lake (Barapani) for watersports and stunning pine landscapes.',
      },
      {
        day: 2,
        title: 'Shillong to Cherrapunji: Nohkalikai Falls & Mawsmai Caves',
        stay: 'Cherrapunji Mist Resort',
        meals: 'Breakfast & Dinner',
        description:
          'Drive to Sohra (Cherrapunji). Marvel at Nohkalikai Falls plunging 1100 ft into turquoise pools, explore prehistoric limestone formations at Mawsmai Cave, and feel the spray of Seven Sisters Falls.',
      },
      {
        day: 3,
        title: 'Double Decker Living Root Bridge Trek at Nongriat',
        stay: 'Cherrapunji Mist Resort',
        meals: 'Breakfast & Dinner',
        description:
          'Descend through dense rainforest steps to witness the wonder of bio-engineered living rubber-fig root bridges. Refresh yourself at Rainbow Falls turquoise natural pools.',
      },
      {
        day: 4,
        title: 'Mawlynnong Cleanest Village & Crystal Clear Dawki River',
        stay: 'Shillong Pine Resort',
        meals: 'Breakfast & Dinner',
        description:
          'Visit Mawlynnong, famous for manicured flower pathways and balancing rock. Glide on glass-clear water in Dawki where boats appear floating on thin air right beside the Indo-Bangladesh border.',
      },
      {
        day: 5,
        title: 'Laitlum Grand Canyon & Shillong Cultural Discovery',
        stay: 'Shillong Pine Resort',
        meals: 'Breakfast & Dinner',
        description:
          'Witness the endless drop and rolling emerald mist of Laitlum Canyons. Visit Don Bosco Indigenous Museum and enjoy café hopping in vibrant Police Bazar.',
      },
      {
        day: 6,
        title: 'Kamakhya Temple Blessings & Departure from Guwahati',
        meals: 'Breakfast',
        description:
          'Morning darshan at the revered Kamakhya Devi Temple on Nilachal Hill before catching your flight home.',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
    ],
    rating_avg: 4.9,
    review_count: 115,
    is_featured: true,
    is_active: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    slug: 'andaman-4n-5d',
    title: 'Andaman Island Bliss: Radhanagar Beach & Coral Reefs',
    destination: 'Andaman 4N/5D',
    duration_days: 5,
    duration_nights: 4,
    duration: '4N/5D',
    price_per_person: 14800,
    original_price: 18500,
    discount_percent: 20,
    price_unit: 'person',
    audience: ['couple', 'family', 'group'],
    description:
      'Feel the soft white sands of Radhanagar Beach (voted Asia’s best beach by TIME), experience high-speed luxury catamaran cruises across islands, snorkel vibrant coral gardens at Elephant Beach, and witness the patriotic Light & Sound show at Cellular Jail.',
    inclusions: [
      '4 Nights hotel stay (Port Blair + Havelock Island beachside resort)',
      'Daily breakfast at all resorts',
      'Makruzz / Nautika high-speed private AC catamaran ferry tickets',
      'Entry permits, jetty transfers and private sightseeing vehicle',
      'Complimentary snorkeling session at Elephant Beach',
      'Dedicated Aariva island coordinator at every jetty',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Port Blair Arrival, Corbyn’s Cove & Historic Cellular Jail',
        stay: 'Port Blair Sea View Hotel',
        meals: 'Dinner',
        description:
          'Arrive at Veer Savarkar Airport Port Blair. Check in and visit Corbyn’s Cove coconut fringed beach. In the evening, witness the emotionally stirring Cellular Jail Light & Sound show.',
      },
      {
        day: 2,
        title: 'High-speed Cruise to Havelock & Sunset at Radhanagar Beach',
        stay: 'Havelock Island Beach Resort',
        meals: 'Breakfast',
        description:
          'Board the sleek catamaran to Swaraj Dweep (Havelock). Afternoon at the world-renowned Radhanagar Beach enjoying warm turquoise waves and unforgettable golden sunsets.',
      },
      {
        day: 3,
        title: 'Elephant Beach Coral Snorkeling & Water Adventure',
        stay: 'Havelock Island Beach Resort',
        meals: 'Breakfast',
        description:
          'Speed boat to Elephant Beach. Marvel at live coral formations, clownfish, and sea turtles with included snorkeling. Optional scuba diving & sea-walking available.',
      },
      {
        day: 4,
        title: 'Catamaran Cruise back to Port Blair & Sagarika Shopping',
        stay: 'Port Blair Sea View Hotel',
        meals: 'Breakfast',
        description:
          'Ferry back to Port Blair. Visit the government cottage industries emporium Sagarika for pearls, seashells, and Andaman padauk wooden crafts.',
      },
      {
        day: 5,
        title: 'Departure with Tropical Island Memories',
        meals: 'Breakfast',
        description:
          'Check out after breakfast and transfer to Port Blair airport with sun-kissed memories of emerald waters.',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    ],
    rating_avg: 4.7,
    review_count: 184,
    is_featured: true,
    is_active: true,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    slug: 'lakshadweep',
    title: 'Lakshadweep Tropical Paradise: Agatti, Bangaram & Thinnakara',
    destination: 'Lakshadweep',
    duration_days: 5,
    duration_nights: 4,
    duration: '4N/5D',
    price_per_person: 24800,
    original_price: 29500,
    discount_percent: 16,
    price_unit: 'person',
    audience: ['couple', 'group', 'family'],
    description:
      'Step onto India’s most exclusive coral atoll archipelago. Fly directly into the runway on the sea at Agatti, hop across uninhabited jewel islands Bangaram and Thinnakara, swim alongside sea turtles in translucent lagoons, and unwind in secluded beachfront cottages.',
    inclusions: [
      '4 Nights beach cottage stay right on the coral lagoon',
      'All 3 meals (breakfast, lunch, evening tea, and dinner) included',
      'Lakshadweep Heritage Entry Permit & processing paperwork',
      'Airport pick & drop by private island vehicle',
      'Island boat excursion to Bangaram & Thinnakara',
      'Glass-bottom boat ride to view coral gardens',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Flight into Agatti’s Sea Runway & Lagoon Welcome',
        stay: 'Agatti Island Lagoon Resort',
        meals: 'Lunch & Dinner',
        description:
          'Experience one of the world’s most cinematic flight landings on Agatti strip bordered by turquoise sea on both sides. Sip fresh coconut water and stroll the serene private lagoon.',
      },
      {
        day: 2,
        title: 'Speedboat Excursion to Uninhabited Bangaram Island',
        stay: 'Agatti Island Lagoon Resort',
        meals: 'Breakfast, Lunch & Dinner',
        description:
          'Cruise to Bangaram Atoll, a tear-drop shaped haven surrounded by shallow sapphire lagoons. Spot playful dolphins and relax on powdery sandbars.',
      },
      {
        day: 3,
        title: 'Shipwreck Snorkeling & Thinnakara Turtle Haven',
        stay: 'Agatti Island Lagoon Resort',
        meals: 'Breakfast, Lunch & Dinner',
        description:
          'Explore Thinnakara island and snorkel near a mysterious historic shipwreck teeming with marine life, manta rays, and gentle green sea turtles.',
      },
      {
        day: 4,
        title: 'Kalpitti Island Sunset & Agatti Cultural Exploration',
        stay: 'Agatti Island Lagoon Resort',
        meals: 'Breakfast, Lunch & Dinner',
        description:
          'Visit traditional coir weaving units, fisheries museum, and take an evening boat ride to Kalpitti island for an unforgettable tropical sunset.',
      },
      {
        day: 5,
        title: 'Bid Goodbye to the Coral Coral Archipelago',
        meals: 'Breakfast',
        description:
          'Transfer to Agatti Airport for your onward flight to Kochi with timeless island stories.',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',
    ],
    rating_avg: 4.9,
    review_count: 98,
    is_featured: true,
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    slug: 'kashmir-couple-special',
    title: 'Kashmir Couple Special: Dal Lake Shikara & Gulmarg Gondola',
    destination: 'Kashmir Couple Special',
    duration_days: 6,
    duration_nights: 5,
    duration: '5N/6D',
    price_per_person: 14999,
    original_price: 18999,
    discount_percent: 21,
    price_unit: 'person',
    audience: ['couple', 'family'],
    description:
      'Lose your heart to the Paradise on Earth. Sleep in a handcrafted cedarwood houseboat on Dal Lake, drift softly on private flower-decked Shikaras, ascend to snow peaks on the world’s second highest cable car (Gulmarg Gondola), and wander fragrant saffron valleys in Pahalgam.',
    inclusions: [
      '1 Night in Luxury Cedarwood Houseboat with candlelight dinner & flower bed',
      '4 Nights in premium 4-star boutique hotels (Pahalgam & Srinagar)',
      'Daily breakfast and royal Kashmiri Wazwan / vegetarian dinners',
      'Complimentary 1-hour private sunset Shikara ride on Dal Lake',
      'Private sanitized sedan for all transfers and mountain routes',
      'Gulmarg Gondola Phase 1 booking assistance & 24x7 trip marshal',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Srinagar Arrival & Romantic Dal Lake Shikara Cruise',
        stay: 'Royal Heritage Dal Lake Houseboat',
        meals: 'Dinner with Candlelight Setting',
        description:
          'Warm Kashmiri Kehwa greeting on arrival. Check in to your heritage houseboat. As dusk sets, enjoy a private Shikara glide past floating vegetable markets and Meena Bazaar.',
      },
      {
        day: 2,
        title: 'Srinagar to Gulmarg Meadow of Flowers & Snow Peak Gondola',
        stay: 'Gulmarg Pine Resort',
        meals: 'Breakfast & Dinner',
        description:
          'Drive through snow-covered pine ridges to Gulmarg. Ride the world-famous Gondola cable car reaching Kongdoori / Apharwat peak at 13,780 ft. Build snowmen and sip warm saffron tea.',
      },
      {
        day: 3,
        title: 'Valley of Shepherds: Pahalgam & Saffron Fields of Pampore',
        stay: 'Pahalgam Riverview Cottage',
        meals: 'Breakfast & Dinner',
        description:
          'Drive past purple saffron fields and Avantipur ruins to Pahalgam along the roaring Lidder River. Walk hand-in-hand through pine glades and listen to gushing waters.',
      },
      {
        day: 4,
        title: 'Betaab Valley, Aru Village & Chandanwari Exploration',
        stay: 'Pahalgam Riverview Cottage',
        meals: 'Breakfast & Dinner',
        description:
          'Visit Betaab Valley where Bollywood classics were filmed. Head to Aru Valley for pony rides and panoramic Himalayan meadow vistas.',
      },
      {
        day: 5,
        title: 'Mughal Gardens of Srinagar (Shalimar & Nishat Bagh)',
        stay: 'Srinagar Boutique Hotel',
        meals: 'Breakfast & Dinner',
        description:
          'Return to Srinagar to stroll the stepped terraces and cascading fountains of Mughal Shalimar and Nishat Gardens, followed by shopping for authentic pashmina shawls and walnuts.',
      },
      {
        day: 6,
        title: 'Farewell Kashmir with Memories of Paradise',
        meals: 'Breakfast',
        description:
          'Morning breakfast with Shankaracharya Hill views before your chauffeur drops you at Srinagar Airport.',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
    ],
    rating_avg: 4.9,
    review_count: 210,
    is_featured: true,
    is_active: true,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    slug: 'andaman-luxury-honeymoon',
    title: 'Andaman Luxury Honeymoon: Private Pool Villa & Stargazing Cruise',
    destination: 'Andaman Luxury Honeymoon',
    duration_days: 6,
    duration_nights: 5,
    duration: '5N/6D',
    price_per_person: 100000,
    original_price: 125000,
    discount_percent: 20,
    price_unit: 'couple',
    audience: ['couple'],
    description:
      'The ultimate romantic sanctuary for newlyweds. Indulge in 5 nights of five-star luxury with private beachfront plunge pool villas at Taj Exotica / Barefoot Havelock, private candlelit dinner under the tropical stars on Radhanagar Beach, couple spa massages, and luxury yacht charters.',
    inclusions: [
      '5 Nights in Luxury 5-Star Beach Villa with Private Plunge Pool',
      'Gourmet breakfast, high-tea, and 5-course romantic dining every night',
      'Private 4-course Candlelight Beach Dinner with wine and floral table setting',
      'Private premium luxury catamaran cabin tickets with priority boarding',
      'Complimentary couple aromatherapy rejuvenation spa session',
      'Chauffeured luxury SUV for all transfers and bespoke itinerary flexibility',
    ],
    itinerary: [
      {
        day: 1,
        title: 'VIP Arrival in Port Blair & Chidiya Tapu Sunset Point',
        stay: 'Symphony Samudra 5-Star Beach Villa',
        meals: 'Gourmet Dinner',
        description:
          'Receive champagne welcome on arrival. Afternoon transfer to picturesque Chidiya Tapu (Bird Island) for one of the most romantic sunsets in the Bay of Bengal.',
      },
      {
        day: 2,
        title: 'Luxury Yacht to Havelock & Check-in to Private Plunge Villa',
        stay: 'Taj Exotica / Havelock Luxury Plunge Villa',
        meals: 'Breakfast & Chef Dinner',
        description:
          'Travel in executive VIP class aboard private catamaran. Settle into your secluded villa tucked amidst ancient padauk trees and powdery beach sands.',
      },
      {
        day: 3,
        title: 'Private Yacht Charter to Secluded Neil Island & Snorkeling',
        stay: 'Taj Exotica / Havelock Luxury Plunge Villa',
        meals: 'Breakfast & Beach Picnic',
        description:
          'Private charter sail to secluded coves. Swim together in calm azure waters, followed by an artisanal picnic basket served on pristine sands.',
      },
      {
        day: 4,
        title: 'Couple Rejuvenation Spa & Candlelight Beach Dinner',
        stay: 'Taj Exotica / Havelock Luxury Plunge Villa',
        meals: 'Breakfast & 4-Course Candlelight Dinner',
        description:
          'Morning holistic couple wellness massage. At dusk, walk hand-in-hand to a secluded beach enclave decorated with lanterns, flowers, and live acoustic music for a romantic dinner.',
      },
      {
        day: 5,
        title: 'Kalapathar Beach Turquoise Drive & Leisure Strolls',
        stay: 'Taj Exotica / Havelock Luxury Plunge Villa',
        meals: 'Breakfast & Dinner',
        description:
          'Scenic open-air jeep ride along Kalapathar Beach coastal road where black volcanic boulders meet emerald seas. Relax in your private plunge pool.',
      },
      {
        day: 6,
        title: 'Private Transfer & Homeward Journey with Lifelong Memories',
        meals: 'Royal Champagne Breakfast',
        description:
          'Private catamaran transfer to Port Blair for your VIP drop to the airport with special honeymoon souvenir gifts from Aariva Voyages.',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
    ],
    rating_avg: 5.0,
    review_count: 76,
    is_featured: true,
    is_active: true,
  },
];

export const LOCAL_SEED_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    package_id: '11111111-1111-1111-1111-111111111111',
    package_slug: 'sikkim-darjeeling',
    package_title: 'Sikkim & Darjeeling Himalayan Escapade',
    traveler_name: 'Rohan & Sneha Kulkarni',
    rating: 5,
    comment:
      'Our Sikkim trip was flawlessly managed by Aariva Voyages. The 4:00 AM sunrise from Tiger Hill with piping hot Darjeeling tea was breathtaking as Kanchenjunga turned golden. Our private SUV driver was courteous, and all inner-line permits were cleared in advance without any hassle!',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626014303757-646736203cf3?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Family Vacation (Pune)',
    created_at: '2026-09-15T10:30:00Z',
    helpful_count: 34,
  },
  {
    id: 'rev-002',
    package_id: '11111111-1111-1111-1111-111111111111',
    package_slug: 'sikkim-darjeeling',
    package_title: 'Sikkim & Darjeeling Himalayan Escapade',
    traveler_name: 'Amit & Priya Sen',
    rating: 5,
    comment:
      'Tsomgo Lake at 12,400 ft was stunning! We took yak rides and the lake water was crystal pure against snow slopes. The Darjeeling heritage retreat had mesmerizing valley views right from our room balcony.',
    photos: [
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Couple Mountain Retreat (Mumbai)',
    created_at: '2026-09-10T14:15:00Z',
    helpful_count: 21,
  },
  {
    id: 'rev-003',
    package_id: '11111111-1111-1111-1111-111111111111',
    package_slug: 'sikkim-darjeeling',
    package_title: 'Sikkim & Darjeeling Himalayan Escapade',
    traveler_name: 'Debolina Mukherjee',
    rating: 4,
    comment:
      'Visiting Happy Valley Tea Estate and the Peace Pagoda was so peaceful. The travel marshal checked in daily on WhatsApp to ensure we had no altitude issues. Highly recommended tour for anyone seeking calm mountain air.',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Solo Explorer (Kolkata)',
    created_at: '2026-08-28T09:20:00Z',
    helpful_count: 12,
  },
  {
    id: 'rev-004',
    package_id: '22222222-2222-2222-2222-222222222222',
    package_slug: 'assam-meghalaya',
    package_title: 'Assam & Meghalaya: The Abode of Clouds & Living Root Bridges',
    traveler_name: 'Aniket Roy & Friends',
    rating: 5,
    comment:
      'Trekking down the 3,500 stone steps to the Double Decker Living Root Bridge in Nongriat was the highlight of our year! Swimming in natural turquoise pools at Rainbow Falls was pure bliss. Aariva arranged local Khasi guides who were wonderful.',
    photos: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Adventure Group (Kolkata)',
    created_at: '2026-09-18T09:00:00Z',
    helpful_count: 47,
  },
  {
    id: 'rev-005',
    package_id: '22222222-2222-2222-2222-222222222222',
    package_slug: 'assam-meghalaya',
    package_title: 'Assam & Meghalaya: The Abode of Clouds & Living Root Bridges',
    traveler_name: 'Dr. Ramesh Nair',
    rating: 5,
    comment:
      'Kaziranga open-top jeep safari gave us up-close views of one-horned rhinos and wild elephants. Umiam lake boathouse stay was scenic and serene. Every meal had authentic regional flavors.',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Family Holiday (Chennai)',
    created_at: '2026-09-04T12:00:00Z',
    helpful_count: 19,
  },
  {
    id: 'rev-006',
    package_id: '33333333-3333-3333-3333-333333333333',
    package_slug: 'andaman-4n-5d',
    package_title: 'Andaman Island Bliss: Port Blair, Havelock & Radhanagar Beach',
    traveler_name: 'Vikram & Divya Nair',
    rating: 5,
    comment:
      'Radhanagar Beach was as pristine as promised. We enjoyed the catamaran ferry to Havelock and our snorkeling session at Elephant Beach was fully assisted by certified divers. Zero stress from start to finish. 10/10 recommend Aariva!',
    photos: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Couple Getaway (Bengaluru)',
    created_at: '2026-09-12T16:20:00Z',
    helpful_count: 38,
  },
  {
    id: 'rev-007',
    package_id: '33333333-3333-3333-3333-333333333333',
    package_slug: 'andaman-4n-5d',
    package_title: 'Andaman Island Bliss: Port Blair, Havelock & Radhanagar Beach',
    traveler_name: 'Pooja Hegde & Gang',
    rating: 5,
    comment:
      'The light and sound show at Cellular Jail gave goosebumps. Scuba diving in Havelock reef had crystal clear visibility. Clean beach resorts and timely transfers.',
    photos: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Friends Reunion (Hyderabad)',
    created_at: '2026-08-30T15:40:00Z',
    helpful_count: 22,
  },
  {
    id: 'rev-008',
    package_id: '44444444-4444-4444-4444-444444444444',
    package_slug: 'lakshadweep',
    package_title: 'Lakshadweep Coral Paradise: Agatti, Bangaram & Thinnakara',
    traveler_name: 'Kabir Mehta',
    rating: 5,
    comment:
      'Landing on the Agatti island sea strip is something you only see in movies! Swimming alongside sea turtles in the shallow turquoise Bangaram lagoon was surreal. Aariva handled all the restricted area permits and flights seamlessly.',
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Island Explorers (Mumbai)',
    created_at: '2026-09-08T11:45:00Z',
    helpful_count: 52,
  },
  {
    id: 'rev-009',
    package_id: '44444444-4444-4444-4444-444444444444',
    package_slug: 'lakshadweep',
    package_title: 'Lakshadweep Coral Paradise: Agatti, Bangaram & Thinnakara',
    traveler_name: 'Farhan & Ayesha Khan',
    rating: 5,
    comment:
      'Pure Maldives vibes right here in India without the international visa and currency headache. Snorkeling with baby rays at Thinnakara sandbank was unforgettable.',
    photos: [
      'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Honeymoon Escape (Ahmedabad)',
    created_at: '2026-08-25T17:15:00Z',
    helpful_count: 29,
  },
  {
    id: 'rev-010',
    package_id: '55555555-5555-5555-5555-555555555555',
    package_slug: 'kashmir-couple-special',
    package_title: 'Kashmir Couple Special: Dal Lake Houseboat & Gulmarg Snows',
    traveler_name: 'Aditya & Meera Singhania',
    rating: 5,
    comment:
      'The Dal Lake carved wooden houseboat experience and private candlelit Shikara ride was magical. Taking the Gulmarg Gondola Phase 2 to 14,000 ft surrounded by fresh powder snow felt like Switzerland. The Aariva coordinator followed up everyday to ensure 5-star comfort.',
    photos: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Honeymoon Special (Delhi)',
    created_at: '2026-09-20T18:00:00Z',
    helpful_count: 63,
  },
  {
    id: 'rev-011',
    package_id: '55555555-5555-5555-5555-555555555555',
    package_slug: 'kashmir-couple-special',
    package_title: 'Kashmir Couple Special: Dal Lake Houseboat & Gulmarg Snows',
    traveler_name: 'Tanvi & Chirag Jain',
    rating: 5,
    comment:
      'Betaab Valley and Aru Valley in Pahalgam were breathtaking with pine groves and crystal streams. The heated cab and warm hospitality of the Kashmiri hosts made our anniversary unforgettable.',
    photos: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Anniversary Tour (Jaipur)',
    created_at: '2026-09-02T13:30:00Z',
    helpful_count: 31,
  },
  {
    id: 'rev-012',
    package_id: '66666666-6666-6666-6666-666666666666',
    package_slug: 'andaman-luxury-honeymoon',
    package_title: 'Andaman Royal Honeymoon: Private Catamaran & Beachfront Villa',
    traveler_name: 'Siddharth & Karishma Oberoi',
    rating: 5,
    comment:
      'Worth every single rupee! The private plunge villa at Havelock was absolute paradise. The 4-course candlelight dinner on the beach under starlit skies with live violin was something we will remember forever. VIP speed catamaran transfers saved hours of waiting.',
    photos: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Luxury Honeymoon (Mumbai)',
    created_at: '2026-09-22T20:30:00Z',
    helpful_count: 58,
  },
  {
    id: 'rev-013',
    package_id: '66666666-6666-6666-6666-666666666666',
    package_slug: 'andaman-luxury-honeymoon',
    package_title: 'Andaman Royal Honeymoon: Private Catamaran & Beachfront Villa',
    traveler_name: 'Gaurav & Natasha Kapoor',
    rating: 5,
    comment:
      'The champagne breakfast in the private plunge pool and the couple spa session at Taj Exotica were world-class. If you are planning a once-in-a-lifetime honeymoon, book this without a second thought!',
    photos: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ],
    trip_label: 'Luxury Escape (Gurugram)',
    created_at: '2026-09-05T19:10:00Z',
    helpful_count: 41,
  },
];
