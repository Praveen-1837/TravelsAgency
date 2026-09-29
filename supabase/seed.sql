-- Aariva Voyages — Database Seed Data
-- 1. Official Launch Packages (6 Domestic Packages)
-- 2. Clearly Marked Demo Reviews (is_approved = true, easy to wipe via DELETE WHERE id LIKE 'demo-%')

-- =========================================================================
-- 1. SEED PACKAGES
-- =========================================================================

INSERT INTO public.packages (
    id,
    slug,
    title,
    destination,
    duration_days,
    duration_nights,
    duration,
    price_per_person,
    original_price,
    discount_percent,
    price_unit,
    audience,
    description,
    inclusions,
    itinerary,
    images,
    rating_avg,
    review_count,
    is_featured,
    is_active
) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'sikkim-darjeeling',
    'Sikkim & Darjeeling Himalayan Escapade',
    'Sikkim-Darjeeling',
    7,
    6,
    '6N/7D',
    11300.00,
    14500.00,
    22,
    'person',
    ARRAY['group', 'family', 'couple'],
    'Immerse yourself in the tranquility of the Eastern Himalayas. Watch the sunrise over Mt. Kanchenjunga from Tiger Hill, wander through aromatic Darjeeling tea gardens, visit peaceful Buddhist monasteries in Gangtok, and explore the crystal-clear waters of Tsomgo Lake at 12,400 ft.',
    ARRAY[
        '6 Nights accommodation in premium 3-star view hotels',
        'Daily delicious breakfast and dinner included',
        'Private dedicated SUV transfers throughout the tour',
        'Tsomgo Lake & Baba Mandir permit assistance',
        'Toy Train joy ride assistance in Darjeeling',
        '24x7 local on-trip marshal and support'
    ],
    '[
        {"day": 1, "title": "Arrival at Bagdogra / NJP & Scenic Drive to Gangtok", "stay": "Gangtok View Resort", "meals": "Dinner", "description": "Meet your private Aariva chauffeur at Bagdogra Airport or NJP station. Embark on a breathtaking drive along the Teesta River climbing into Sikkim. Check in, relax, and stroll MG Marg in the evening.", "highlights": ["Teesta Valley views", "Evening stroll at MG Marg", "Welcome dinner"]},
        {"day": 2, "title": "Excursion to Glacial Tsomgo Lake & Baba Harbhajan Mandir", "altitude": "12,400 ft", "stay": "Gangtok View Resort", "meals": "Breakfast & Dinner", "description": "Ascend through high-altitude misty mountain roads to the sacred Tsomgo Lake. Witness pristine alpine reflections, ride friendly yaks, and pay homage at the legendary Baba Mandir.", "highlights": ["Sacred glacial lake", "Yak ride opportunity", "Alpine terrain"]},
        {"day": 3, "title": "Gangtok Local Sights & Drive to Queen of Hills, Darjeeling", "stay": "Darjeeling Colonial Retreat", "meals": "Breakfast & Dinner", "description": "Visit Do Drul Chorten Stupa and the Namgyal Institute of Tibetology. After lunch, enjoy a picturesque drive winding through pine forests and misty emerald slopes into Darjeeling.", "highlights": ["Tibetan architecture", "Pine forest drive", "Darjeeling Mall Road"]},
        {"day": 4, "title": "Tiger Hill Sunrise, Ghoom Monastery & Tea Gardens", "stay": "Darjeeling Colonial Retreat", "meals": "Breakfast & Dinner", "description": "Early morning 4:00 AM ascent to Tiger Hill to watch the golden sunrise illuminate Kanchenjunga. Visit historical Ghoom Monastery, Batasia Loop memorial, and Happy Valley Tea Estate.", "highlights": ["Iconic Tiger Hill sunrise", "Batasia Loop spirals", "World-famous tea tasting"]},
        {"day": 5, "title": "Mirik Lake Leisure & Pashupati Nepal Border Crossing", "stay": "Darjeeling Colonial Retreat", "meals": "Breakfast & Dinner", "description": "Excursion to peaceful Sumendu Lake (Mirik). Boating amidst Japanese cedars and explore the border market for regional handicrafts and souvenirs.", "highlights": ["Mirik Lake boating", "Cardamom plantations", "Border crafts shopping"]},
        {"day": 6, "title": "Heritage Walk, Peace Pagoda & Himalayan Mountaineering Institute", "stay": "Darjeeling Colonial Retreat", "meals": "Breakfast & Dinner", "description": "Discover Japanese Peace Pagoda, HMI museum showcasing Everest expeditions, and the Padmaja Naidu Himalayan Zoological Park home to Red Pandas and Snow Leopards.", "highlights": ["Red Panda spotting", "HMI climbing exhibits", "Peace Pagoda sunset"]},
        {"day": 7, "title": "Farewell Himalayas & Transfer to Bagdogra / NJP", "meals": "Breakfast", "description": "Savor one last authentic cup of Darjeeling tea with panoramic valley views before our chauffeur drops you at Bagdogra or NJP with cherished memories."}
    ]'::JSONB,
    ARRAY[
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1626014303757-646736203cf3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80'
    ],
    4.8,
    142,
    true,
    true
),
(
    '22222222-2222-2222-2222-222222222222',
    'assam-meghalaya',
    'Assam & Meghalaya: The Abode of Clouds & Living Root Bridges',
    'Assam-Meghalaya',
    6,
    5,
    '5N/6D',
    15800.00,
    19800.00,
    20,
    'person',
    ARRAY['group', 'family', 'couple'],
    'Explore magical Northeast India: navigate the crystal clear waters of Umngot River at Dawki, trek to centuries-old UNESCO-candidate Living Root Bridges in Cherrapunji, witness Asia’s cleanest village at Mawlynnong, and look out for One-Horned Rhinoceroses in Kaziranga.',
    ARRAY[
        '5 Nights stays in scenic eco-resorts & boutique hotels',
        'Breakfast and dinner included everyday',
        'Private AC vehicle for all transfers and sightseeing',
        'Permits, parking, and toll taxes included',
        'Dawki country boat ride experience included',
        '24x7 personal trip coordinator assistance'
    ],
    '[
        {"day": 1, "title": "Guwahati Arrival to the Scottish Highlands of the East: Shillong", "stay": "Shillong Pine Resort", "meals": "Dinner", "description": "Arrive at Guwahati Airport and head toward Shillong. Stop by the majestic Umiam Lake (Barapani) for watersports and stunning pine landscapes."},
        {"day": 2, "title": "Shillong to Cherrapunji: Nohkalikai Falls & Mawsmai Caves", "stay": "Cherrapunji Mist Resort", "meals": "Breakfast & Dinner", "description": "Drive to Sohra (Cherrapunji). Marvel at Nohkalikai Falls plunging 1100 ft into turquoise pools, explore prehistoric limestone formations at Mawsmai Cave, and feel the spray of Seven Sisters Falls."},
        {"day": 3, "title": "Double Decker Living Root Bridge Trek at Nongriat", "stay": "Cherrapunji Mist Resort", "meals": "Breakfast & Dinner", "description": "Descend through dense rainforest steps to witness the wonder of bio-engineered living rubber-fig root bridges. Refresh yourself at Rainbow Falls turquoise natural pools."},
        {"day": 4, "title": "Mawlynnong Cleanest Village & Crystal Clear Dawki River", "stay": "Shillong Pine Resort", "meals": "Breakfast & Dinner", "description": "Visit Mawlynnong, famous for manicured flower pathways and balancing rock. Glide on glass-clear water in Dawki where boats appear floating on thin air right beside the Indo-Bangladesh border."},
        {"day": 5, "title": "Laitlum Grand Canyon & Shillong Cultural Discovery", "stay": "Shillong Pine Resort", "meals": "Breakfast & Dinner", "description": "Witness the endless drop and rolling emerald mist of Laitlum Canyons. Visit Don Bosco Indigenous Museum and enjoy café hopping in vibrant Police Bazar."},
        {"day": 6, "title": "Kamakhya Temple Blessings & Departure from Guwahati", "meals": "Breakfast", "description": "Morning darshan at the revered Kamakhya Devi Temple on Nilachal Hill before catching your flight home."}
    ]'::JSONB,
    ARRAY[
        'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80'
    ],
    4.9,
    115,
    true,
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    'andaman-4n-5d',
    'Andaman Island Bliss: Radhanagar Beach & Coral Reefs',
    'Andaman 4N/5D',
    5,
    4,
    '4N/5D',
    14800.00,
    18500.00,
    20,
    'person',
    ARRAY['couple', 'family', 'group'],
    'Feel the soft white sands of Radhanagar Beach (voted Asia’s best beach by TIME), experience high-speed luxury catamaran cruises across islands, snorkel vibrant coral gardens at Elephant Beach, and witness the patriotic Light & Sound show at Cellular Jail.',
    ARRAY[
        '4 Nights hotel stay (Port Blair + Havelock Island beachside resort)',
        'Daily breakfast at all resorts',
        'Makruzz / Nautika high-speed private AC catamaran ferry tickets',
        'Entry permits, jetty transfers and private sightseeing vehicle',
        'Complimentary snorkeling session at Elephant Beach',
        'Dedicated Aariva island coordinator at every jetty'
    ],
    '[
        {"day": 1, "title": "Port Blair Arrival, Corbyn’s Cove & Historic Cellular Jail", "stay": "Port Blair Sea View Hotel", "meals": "Dinner", "description": "Arrive at Veer Savarkar Airport Port Blair. Check in and visit Corbyn’s Cove coconut fringed beach. In the evening, witness the emotionally stirring Cellular Jail Light & Sound show."},
        {"day": 2, "title": "High-speed Cruise to Havelock & Sunset at Radhanagar Beach", "stay": "Havelock Island Beach Resort", "meals": "Breakfast", "description": "Board the sleek catamaran to Swaraj Dweep (Havelock). Afternoon at the world-renowned Radhanagar Beach enjoying warm turquoise waves and unforgettable golden sunsets."},
        {"day": 3, "title": "Elephant Beach Coral Snorkeling & Water Adventure", "stay": "Havelock Island Beach Resort", "meals": "Breakfast", "description": "Speed boat to Elephant Beach. Marvel at live coral formations, clownfish, and sea turtles with included snorkeling. Optional scuba diving & sea-walking available."},
        {"day": 4, "title": "Catamaran Cruise back to Port Blair & Sagarika Shopping", "stay": "Port Blair Sea View Hotel", "meals": "Breakfast", "description": "Ferry back to Port Blair. Visit the government cottage industries emporium Sagarika for pearls, seashells, and Andaman padauk wooden crafts."},
        {"day": 5, "title": "Departure with Tropical Island Memories", "meals": "Breakfast", "description": "Check out after breakfast and transfer to Port Blair airport with sun-kissed memories of emerald waters."}
    ]'::JSONB,
    ARRAY[
        'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    4.7,
    184,
    true,
    true
),
(
    '44444444-4444-4444-4444-444444444444',
    'lakshadweep',
    'Lakshadweep Tropical Paradise: Agatti, Bangaram & Thinnakara',
    'Lakshadweep',
    5,
    4,
    '4N/5D',
    24800.00,
    29500.00,
    16,
    'person',
    ARRAY['couple', 'group', 'family'],
    'Step onto India’s most exclusive coral atoll archipelago. Fly directly into the runway on the sea at Agatti, hop across uninhabited jewel islands Bangaram and Thinnakara, swim alongside sea turtles in translucent lagoons, and unwind in secluded beachfront cottages.',
    ARRAY[
        '4 Nights beach cottage stay right on the coral lagoon',
        'All 3 meals (breakfast, lunch, evening tea, and dinner) included',
        'Lakshadweep Heritage Entry Permit & processing paperwork',
        'Airport pick & drop by private island vehicle',
        'Island boat excursion to Bangaram & Thinnakara',
        'Glass-bottom boat ride to view coral gardens'
    ],
    '[
        {"day": 1, "title": "Flight into Agatti’s Sea Runway & Lagoon Welcome", "stay": "Agatti Island Lagoon Resort", "meals": "Lunch & Dinner", "description": "Experience one of the world’s most cinematic flight landings on Agatti strip bordered by turquoise sea on both sides. Sip fresh coconut water and stroll the serene private lagoon."},
        {"day": 2, "title": "Speedboat Excursion to Uninhabited Bangaram Island", "stay": "Agatti Island Lagoon Resort", "meals": "Breakfast, Lunch & Dinner", "description": "Cruise to Bangaram Atoll, a tear-drop shaped haven surrounded by shallow sapphire lagoons. Spot playful dolphins and relax on powdery sandbars."},
        {"day": 3, "title": "Shipwreck Snorkeling & Thinnakara Turtle Haven", "stay": "Agatti Island Lagoon Resort", "meals": "Breakfast, Lunch & Dinner", "description": "Explore Thinnakara island and snorkel near a mysterious historic shipwreck teeming with marine life, manta rays, and gentle green sea turtles."},
        {"day": 4, "title": "Kalpitti Island Sunset & Agatti Cultural Exploration", "stay": "Agatti Island Lagoon Resort", "meals": "Breakfast, Lunch & Dinner", "description": "Visit traditional coir weaving units, fisheries museum, and take an evening boat ride to Kalpitti island for an unforgettable tropical sunset."},
        {"day": 5, "title": "Bid Goodbye to the Coral Coral Archipelago", "meals": "Breakfast", "description": "Transfer to Agatti Airport for your onward flight to Kochi with timeless island stories."}
    ]'::JSONB,
    ARRAY[
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80'
    ],
    4.9,
    98,
    true,
    true
),
(
    '55555555-5555-5555-5555-555555555555',
    'kashmir-couple-special',
    'Kashmir Couple Special: Dal Lake Shikara & Gulmarg Gondola',
    'Kashmir Couple Special',
    6,
    5,
    '5N/6D',
    14999.00,
    18999.00,
    21,
    'person',
    ARRAY['couple', 'family'],
    'Lose your heart to the Paradise on Earth. Sleep in a handcrafted cedarwood houseboat on Dal Lake, drift softly on private flower-decked Shikaras, ascend to snow peaks on the world’s second highest cable car (Gulmarg Gondola), and wander fragrant saffron valleys in Pahalgam.',
    ARRAY[
        '1 Night in Luxury Cedarwood Houseboat with candlelight dinner & flower bed',
        '4 Nights in premium 4-star boutique hotels (Pahalgam & Srinagar)',
        'Daily breakfast and royal Kashmiri Wazwan / vegetarian dinners',
        'Complimentary 1-hour private sunset Shikara ride on Dal Lake',
        'Private sanitized sedan for all transfers and mountain routes',
        'Gulmarg Gondola Phase 1 booking assistance & 24x7 trip marshal'
    ],
    '[
        {"day": 1, "title": "Srinagar Arrival & Romantic Dal Lake Shikara Cruise", "stay": "Royal Heritage Dal Lake Houseboat", "meals": "Dinner with Candlelight Setting", "description": "Warm Kashmiri Kehwa greeting on arrival. Check in to your heritage houseboat. As dusk sets, enjoy a private Shikara glide past floating vegetable markets and Meena Bazaar."},
        {"day": 2, "title": "Srinagar to Gulmarg Meadow of Flowers & Snow Peak Gondola", "stay": "Gulmarg Pine Resort", "meals": "Breakfast & Dinner", "description": "Drive through snow-covered pine ridges to Gulmarg. Ride the world-famous Gondola cable car reaching Kongdoori / Apharwat peak at 13,780 ft. Build snowmen and sip warm saffron tea."},
        {"day": 3, "title": "Valley of Shepherds: Pahalgam & Saffron Fields of Pampore", "stay": "Pahalgam Riverview Cottage", "meals": "Breakfast & Dinner", "description": "Drive past purple saffron fields and Avantipur ruins to Pahalgam along the roaring Lidder River. Walk hand-in-hand through pine glades and listen to gushing waters."},
        {"day": 4, "title": "Betaab Valley, Aru Village & Chandanwari Exploration", "stay": "Pahalgam Riverview Cottage", "meals": "Breakfast & Dinner", "description": "Visit Betaab Valley where Bollywood classics were filmed. Head to Aru Valley for pony rides and panoramic Himalayan meadow vistas."},
        {"day": 5, "title": "Mughal Gardens of Srinagar (Shalimar & Nishat Bagh)", "stay": "Srinagar Boutique Hotel", "meals": "Breakfast & Dinner", "description": "Return to Srinagar to stroll the stepped terraces and cascading fountains of Mughal Shalimar and Nishat Gardens, followed by shopping for authentic pashmina shawls and walnuts."},
        {"day": 6, "title": "Farewell Kashmir with Memories of Paradise", "meals": "Breakfast", "description": "Morning breakfast with Shankaracharya Hill views before your chauffeur drops you at Srinagar Airport."}
    ]'::JSONB,
    ARRAY[
        'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80'
    ],
    4.9,
    210,
    true,
    true
),
(
    '66666666-6666-6666-6666-666666666666',
    'andaman-luxury-honeymoon',
    'Andaman Luxury Honeymoon: Private Pool Villa & Stargazing Cruise',
    'Andaman Luxury Honeymoon',
    6,
    5,
    '5N/6D',
    100000.00,
    125000.00,
    20,
    'couple',
    ARRAY['couple'],
    'The ultimate romantic sanctuary for newlyweds. Indulge in 5 nights of five-star luxury with private beachfront plunge pool villas at Taj Exotica / Barefoot Havelock, private candlelit dinner under the tropical stars on Radhanagar Beach, couple spa massages, and luxury yacht charters.',
    ARRAY[
        '5 Nights in Luxury 5-Star Beach Villa with Private Plunge Pool',
        'Gourmet breakfast, high-tea, and 5-course romantic dining every night',
        'Private 4-course Candlelight Beach Dinner with wine and floral table setting',
        'Private premium luxury catamaran cabin tickets with priority boarding',
        'Complimentary couple aromatherapy rejuvenation spa session',
        'Chauffeured luxury SUV for all transfers and bespoke itinerary flexibility'
    ],
    '[
        {"day": 1, "title": "VIP Arrival in Port Blair & Chidiya Tapu Sunset Point", "stay": "Symphony Samudra 5-Star Beach Villa", "meals": "Gourmet Dinner", "description": "Receive champagne welcome on arrival. Afternoon transfer to picturesque Chidiya Tapu (Bird Island) for one of the most romantic sunsets in the Bay of Bengal."},
        {"day": 2, "title": "Luxury Yacht to Havelock & Check-in to Private Plunge Villa", "stay": "Taj Exotica / Havelock Luxury Plunge Villa", "meals": "Breakfast & Chef Dinner", "description": "Travel in executive VIP class aboard private catamaran. Settle into your secluded villa tucked amidst ancient padauk trees and powdery beach sands."},
        {"day": 3, "title": "Private Yacht Charter to Secluded Neil Island & Snorkeling", "stay": "Taj Exotica / Havelock Luxury Plunge Villa", "meals": "Breakfast & Beach Picnic", "description": "Private charter sail to secluded coves. Swim together in calm azure waters, followed by an artisanal picnic basket served on pristine sands."},
        {"day": 4, "title": "Couple Rejuvenation Spa & Candlelight Beach Dinner", "stay": "Taj Exotica / Havelock Luxury Plunge Villa", "meals": "Breakfast & 4-Course Candlelight Dinner", "description": "Morning holistic couple wellness massage. At dusk, walk hand-in-hand to a secluded beach enclave decorated with lanterns, flowers, and live acoustic music for a romantic dinner."},
        {"day": 5, "title": "Kalapathar Beach Turquoise Drive & Leisure Strolls", "stay": "Taj Exotica / Havelock Luxury Plunge Villa", "meals": "Breakfast & Dinner", "description": "Scenic open-air jeep ride along Kalapathar Beach coastal road where black volcanic boulders meet emerald seas. Relax in your private plunge pool."},
        {"day": 6, "title": "Private Transfer & Homeward Journey with Lifelong Memories", "meals": "Royal Champagne Breakfast", "description": "Private catamaran transfer to Port Blair for your VIP drop to the airport with special honeymoon souvenir gifts from Aariva Voyages."}
    ]'::JSONB,
    ARRAY[
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80'
    ],
    5.0,
    76,
    true,
    true
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    price_per_person = EXCLUDED.price_per_person,
    original_price = EXCLUDED.original_price,
    inclusions = EXCLUDED.inclusions,
    itinerary = EXCLUDED.itinerary,
    images = EXCLUDED.images,
    updated_at = NOW();

-- =========================================================================
-- 2. CLEARLY MARKED DEMO REVIEWS (FOR DEMO/TESTING ONLY)
-- Easy to wipe before production: DELETE FROM public.reviews WHERE id::text LIKE '00000000-%';
-- =========================================================================

INSERT INTO public.reviews (
    id,
    package_id,
    traveler_name,
    rating,
    comment,
    photos,
    trip_label,
    is_approved
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'Rohan & Sneha Kulkarni',
    5,
    'Our Sikkim trip was flawlessly managed by Aariva Voyages. The sunrise from Tiger Hill with hot Darjeeling tea was breathtaking. Our driver was extremely polite and the mountain road permits were handled in advance!',
    ARRAY[
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
    ],
    'Family Vacation (Pune)',
    true
),
(
    '00000000-0000-0000-0000-000000000002',
    '55555555-5555-5555-5555-555555555555',
    'Aditya & Meera Singhania',
    5,
    'The Dal Lake houseboat experience and candlelight dinner was magical. Gondola Phase 2 had fresh snow. The Aariva coordinator followed up everyday to ensure everything was on schedule.',
    ARRAY[
        'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80'
    ],
    'Honeymoon Special (Delhi)',
    true
),
(
    '00000000-0000-0000-0000-000000000003',
    '33333333-3333-3333-3333-333333333333',
    'Vikram & Divya Nair',
    5,
    'Radhanagar Beach was as stunning as promised. We enjoyed the catamaran ferry to Havelock and our snorkeling session at Elephant Beach was included without hassle. 10/10 recommend Aariva!',
    ARRAY[
        'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=600&q=80'
    ],
    'Couple Getaway (Bengaluru)',
    true
)
ON CONFLICT (id) DO UPDATE SET
    comment = EXCLUDED.comment,
    rating = EXCLUDED.rating,
    is_approved = EXCLUDED.is_approved;
