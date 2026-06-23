import { Product, User, UserRole, UserStatus } from '../types';
import { NESTED_CATEGORIES } from './categoriesData';
import { productTranslations } from './translations';

export const INITIAL_PRODUCTS: Product[] = [
  // Gadgets
  {
    id: 'p1',
    name: 'TWS Wireless Bluetooth Earbuds - Active Black',
    category: 'গ্যাজেটস (Gadgets)',
    price: 1250,
    originalPrice: 2200,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    description: 'উচ্চমানের হাই-ফাই সাউন্ড কোয়ালিটি সম্পন্ন TWS এয়ারবাডস। এটিতে রয়েছে নয়েজ ক্যান্সেলেশন ফিচার, পানিরোধক ডিজাইন (IPX5), এবং এক চার্জে প্রায় ৬ ঘণ্টা পর্যন্ত প্লাব্যাক সুবিধা। সাথে রয়েছে ৩৫০mAh চার্জিং কেস।',
    rating: 4.8,
    reviewsCount: 148,
    stock: 25,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p2',
    name: 'M4 Smart Fitness Watch with Heart Rate Monitor',
    category: 'গ্যাজেটস (Gadgets)',
    price: 1890,
    originalPrice: 3500,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    description: 'আপনার দৈনন্দিন অ্যাক্টিভিটি ট্র্যাক করতে চমৎকার এই স্মার্টওয়াচ। রয়েছে হার্ট রেট ও স্লিপ মনিটরিং রিডার, রক্তের অক্সিজেন পরিমাপক এবং কল ও মেসেজ নোটিফিকেশন এলার্ট। ব্যাটারি ব্যাকআপ ১০ দিন।',
    rating: 4.5,
    reviewsCount: 92,
    stock: 12,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517502884422-41eaaced0168?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p3',
    name: 'Fast Charging Power Bank 20000mAh - Ultra Compact',
    category: 'গ্যাজেটস (Gadgets)',
    price: 1550,
    originalPrice: 2500,
    image: 'https://images.unsplash.com/photo-1609592424109-dd03bf90875c?w=600&auto=format&fit=crop&q=80',
    description: '২০০০mAh ক্ষমতাসম্পন্ন আল্ট্রা-ফাস্ট চার্জিং পাওয়ার ব্যাঙ্ক। ২টি আউটপুট এবং ২টি ইনপুট পোর্ট রয়েছে। মোবাইল, ট্যাবলেটসহ যেকোনো ডিভাইস দ্রুত চার্জ করতে সক্ষম। ডিসপ্লে ইন্ডিকেটর দিয়ে চার্জের পরিমাণ দেখা যায়।',
    rating: 4.7,
    reviewsCount: 230,
    stock: 40
  },

  // Fashion
  {
    id: 'p4',
    name: 'Premium Cotton Polo Shirt for Men - Deep Blue',
    category: 'ফ্যাশন (Fashion)',
    price: 490,
    originalPrice: 990,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
    description: '১০০% এক্সপোর্ট কোয়ালিটি সুতি কাপড়ে তৈরি আরামদায়ক ক্যাজুয়াল পোলো শার্ট। রেগুলার ফিট এবং কালার ১০০% গ্যারান্টি। যেকোনো আউটিং বা ফর্মাল ব্যবহারের জন্য চমৎকার।',
    rating: 4.6,
    reviewsCount: 315,
    stock: 50,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620012253295-c05cd3e70d67?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p5',
    name: 'Retro Square Sunglasses - UV400 Protection',
    category: 'ফ্যাশন (Fashion)',
    price: 350,
    originalPrice: 750,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    description: 'সূর্যের ক্ষতিকারক অতিবেগুনি রশ্মি (UV) থেকে আপনার চোখকে রক্ষা করার জন্য UV400 সম্বলিত গর্জিয়াস রেট্রো সানগ্লাস। মজবুত ফ্রেম এবং আকর্ষণীয় লুক।',
    rating: 4.3,
    reviewsCount: 88,
    stock: 35
  },
  {
    id: 'p6',
    name: 'Anti-Theft laptop Backpack with USB Charging Port',
    category: 'ফ্যাশন (Fashion)',
    price: 990,
    originalPrice: 1800,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    description: 'ওয়াটারপ্রুফ এবং চুরি প্রতিরোধী ডিজাইনের মাল্টিফাংশনাল ল্যাপটপ ব্যাগ। এতে আছে এক্সটার্নাল ইউএসবি চার্জিং পোর্ট এবং ১৫.৬ ইঞ্চি পর্যন্ত ল্যাপটপ রাখার সুপ্রশস্থ কম্পার্টমেন্ট।',
    rating: 4.7,
    reviewsCount: 112,
    stock: 18,
    isFeatured: true
  },

  // Home & Kitchen
  {
    id: 'p7',
    name: 'Stainless Steel Electric Kettle - 1.8 Litre',
    category: 'হোম ও কিচেন (Home & Kitchen)',
    price: 850,
    originalPrice: 1500,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    description: 'মাত্র ৩ মিনিটে পানি ফোটানোর জন্য শক্তিশালী ১৫০০ ওয়াট অটো-অফ মেকানিজম সংবলিত ইলেকট্রিক কেটলি। স্টেইনলেস স্টিল বডি যা মরিচারোধী এবং টেকসই।',
    rating: 4.4,
    reviewsCount: 74,
    stock: 15
  },
  {
    id: 'p8',
    name: 'Multi-functional Juicer & Blender Machine',
    category: 'হোম ও কিচেন (Home & Kitchen)',
    price: 2450,
    originalPrice: 4200,
    image: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80',
    description: 'শক্তিশালী ৪৫০W মোটর সমৃদ্ধ থ্রি-ইন-ওয়ান ব্লেন্ডার এবং জুসার। মসলা পেষানো, জুস তৈরি ও স্মুদি মিক্সিংয়ের জন্য ৩টি চমৎকার কনটেইনার ও ধারালো স্টেইনলেস স্টিল ব্লেড।',
    rating: 4.5,
    reviewsCount: 46,
    stock: 8
  },

  // Grocery
  {
    id: 'p9',
    name: 'Pure Organic Honey of Sunderbans - 500g',
    category: 'গ্রোসারি (Grocery)',
    price: 480,
    originalPrice: 650,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    description: 'সুন্দরবনের খলিসা ফুলের খাঁটি প্রাকৃতিক চাক ভাঙা মধু। কোনোরূপ কেমিক্যাল বা প্রিজারভেটিভ নেই। প্রাকৃতিক পুষ্টিগুণে ভরপুর ও সুস্বাদু।',
    rating: 4.9,
    reviewsCount: 195,
    stock: 30,
    isFeatured: true
  },
  {
    id: 'p10',
    name: 'Premium Mixed Dry Fruits Booster Pack - 400g',
    category: 'গ্রোসারি (Grocery)',
    price: 650,
    originalPrice: 900,
    image: 'https://images.unsplash.com/photo-1596515109352-a0f72940224b?w=600&auto=format&fit=crop&q=80',
    description: 'কাজুবাদাম, কাঠবাদাম, পেস্তাবাদাম, কিসমিস, খুবানি, ও খেজুরসহ ১০টি সেরা উপাদানের প্রিমিয়াম হেলথ মিক্স। প্রতিদিনের এনার্জি বুস্টআপ করতে ভীষণ কার্যকরী।',
    rating: 4.8,
    reviewsCount: 89,
    stock: 22
  },

  // Beauty
  {
    id: 'p11',
    name: 'Natural Aloe Vera Soothing Gel - 300ml',
    category: 'বিউটি ও কেয়ার (Beauty Care)',
    price: 290,
    originalPrice: 550,
    image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&auto=format&fit=crop&q=80',
    description: 'ত্বকের সতেজতা ও আর্দ্রতা বজায় রাখতে অত্যন্ত কার্যকরী ৯৯% অ্যালোভেরা জেল। সানবার্ন বা শুষ্ক ত্বক মেরামত করে প্রাকৃতিক উজ্জ্বলতা বৃদ্ধি করে।',
    rating: 4.6,
    reviewsCount: 160,
    stock: 45
  },
  {
    id: 'p12',
    name: 'Vitamin C Brightening Face Serum - 30ml',
    category: 'বিউটি ও কেয়ার (Beauty Care)',
    price: 580,
    originalPrice: 950,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    description: 'ত্বকের পিগমেন্টেশন ও কালো দাগ দূর করতে চমৎকার অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ ভিটামিন সি ফেস সিরাম। দ্রুত শোষিত হয় এবং ত্বক করে সতেজ, স্বাস্থ্যোজ্জ্বল ও লাবণ্যময়।',
    rating: 4.7,
    reviewsCount: 104,
    stock: 14
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Aronor Roy',
    email: 'aronoroy047@gmail.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '2026-05-01T10:00:00Z',
    phone: '01711223344',
    password: 'admin123'
  },
  {
    id: 'u2',
    name: 'Rahat Islam',
    email: 'rahat@gmail.com',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '2026-05-15T14:30:00Z',
    phone: '01712345678',
    password: 'rahat123'
  },
  {
    id: 'u3',
    name: 'Saima Akter',
    email: 'saima@yahoo.com',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '2026-06-01T09:15:00Z',
    phone: '01911122233',
    password: 'saima123'
  },
  {
    id: 'u4',
    name: 'Malicious Bot',
    email: 'spam_scrapper@bot.net',
    role: UserRole.USER,
    status: UserStatus.BLOCKED,
    createdAt: '2026-06-10T12:00:00Z',
    phone: '01800000000',
    password: 'spam123'
  }
];

export const CATEGORIES = [
  'সব প্রোডাক্ট (All)',
  'গ্যাজেটস (Gadgets)',
  'ফ্যাশন (Fashion)',
  'মেন্স ফ্যাশন (Men\'s Fashion)',
  'হোম ও কিচেন (Home & Kitchen)',
  'গ্রোসারি (Grocery)',
  'বিউটি ও কেয়ার (Beauty Care)'
];

// --- Product Generator for 50 Products Per Category ---
const IMAGES_BY_CAT: Record<string, string[]> = {
  'গ্যাজেটস (Gadgets)': [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe7cbb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563968743331-044af764f4ae?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
  ],
  'ফ্যাশন (Fashion)': [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583391265517-35bbadd9ee21?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80'
  ],
  'হোম ও কিচেন (Home & Kitchen)': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595231712175-10874c77ea41?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522012188892-24beb302783d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=600&auto=format&fit=crop&q=80'
  ],
  'গ্রোসারি (Grocery)': [
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596515109352-a0f72940224b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1610589165981-2f2c753c79a0?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598965402049-6e6c770c3ec7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'
  ],
  'বিউটি ও কেয়ার (Beauty Care)': [
    'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80'
  ]
};

const SPECIFIC_IMAGES_BY_FEATURE: Record<string, string[]> = {
  // --- FASHION ---
  'Wallets': [
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588444838338-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'
  ],
  'Bags': [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80'
  ],
  'Tote Bags': [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'
  ],
  'Backpacks': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80'
  ],
  'Handbags & Purses': [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590874103328-eacbc8a6182f?w=600&auto=format&fit=crop&q=80'
  ],
  'Clutches & Wristlets': [
    'https://images.unsplash.com/photo-1566150905458-1bf1fc15a490?w=600&auto=format&fit=crop&q=80'
  ],
  'Cotton Saree': [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
  ],
  'Silk Saree': [
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'
  ],
  'Jamdani Saree': [
    'https://images.unsplash.com/photo-1583391265517-35bbadd9ee21?w=600&auto=format&fit=crop&q=80'
  ],
  'Printed Saree': [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
  ],
  'Bridal Saree': [
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'
  ],
  'Boys Fashion': [
    'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop&q=80'
  ],
  'Girls Fashion': [
    'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80'
  ],
  'Newborn & Infant': [
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80'
  ],
  'Footwear Industry': [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80'
  ],
  "Men's Shoes": [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80'
  ],
  "Women's Shoes": [
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80'
  ],
  'Kids Shoes': [
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80'
  ],

  // --- GADGETS ---
  'Mobile Phones': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80'
  ],
  'Tablets': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80'
  ],
  'Smart Wearables': [
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80'
  ],
  'Laptops': [
    'https://images.unsplash.com/photo-1496181130204-755241544e35?w=600&auto=format&fit=crop&q=80'
  ],
  'Desktops': [
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80'
  ],
  'Core Components': [
    'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&auto=format&fit=crop&q=80'
  ],
  'Input / Output': [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
  ],
  'Networking Solutions': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80'
  ],
  'Office Equipment': [
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80'
  ],
  'Portable Audio': [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'
  ],
  'Home Audio': [
    'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80'
  ],
  'Streaming Gear': [
    'https://images.unsplash.com/photo-1590608897129-79da98d15969?w=600&auto=format&fit=crop&q=80'
  ],
  'Flash & External Storage': [
    'https://images.unsplash.com/photo-1609592424109-dd03bf90875c?w=600&auto=format&fit=crop&q=80'
  ],
  'Cameras': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80'
  ],
  'Camera Gears': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80'
  ],

  // --- HOME & KITCHEN ---
  'Smart & LED TVs': [
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80'
  ],
  'Refrigerators': [
    'https://images.unsplash.com/photo-1571175486638-78fe5306e00f?w=600&auto=format&fit=crop&q=80'
  ],
  'Ovens & OTGs': [
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80'
  ],
  'Cookers & Hoods': [
    'https://images.unsplash.com/photo-1522012188892-24beb302783d?w=600&auto=format&fit=crop&q=80'
  ],
  'Washing Machines': [
    'https://images.unsplash.com/photo-1582730149019-d41994b1592c?w=600&auto=format&fit=crop&q=80'
  ],
  'Air Conditioners': [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
  ],
  'Heaters & Purifiers': [
    'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80'
  ],
  'Vacuum Cleaners': [
    'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80'
  ],
  'Blenders & Grinders': [
    'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80'
  ],
  'Rice & Pressure Cookers': [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80'
  ],
  'Kettles & Fryers': [
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80'
  ],
  'Water Purifiers': [
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop&q=80'
  ],
  'Grooming Devices': [
    'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80'
  ],
  'Home Furniture': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'
  ],
  'Living Room Furniture': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'
  ],
  'Bedroom Furniture': [
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80'
  ],
  'Dining room Furniture': [
    'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&auto=format&fit=crop&q=80'
  ],
  'Study & Office Furniture': [
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80'
  ],
  'Home Textiles & Bedding': [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80'
  ],
  'Bedding & Pillows': [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80'
  ],
  'Curtains & Blinds': [
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'
  ],
  'Bath Towels & Mats': [
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80'
  ],
  'Aesthetics & Wall Art': [
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=600&auto=format&fit=crop&q=80'
  ],
  'Lighting Solutions': [
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80'
  ],
  'Candles & Diffusers': [
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80'
  ],
  'Pots & Pans': [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80'
  ],
  'Plates & Dinner sets': [
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80'
  ],
  'Kitchen Utensils': [
    'https://images.unsplash.com/photo-1595231712175-10874c77ea41?w=600&auto=format&fit=crop&q=80'
  ],

  // --- GROCERY ---
  'Rice, Flour & Sugars': [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
  ],
  'Oils & Fats': [
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80'
  ],
  'Spices & Pastes': [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80'
  ],
  'Fresh Fruits & Vegetables': [
    'https://images.unsplash.com/photo-1610397648930-47afb8c211aa?w=600&auto=format&fit=crop&q=80'
  ],
  'Fresh Fish & Meat': [
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80'
  ],
  'Instant Noodles & Soups': [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80'
  ],
  'Condiments & Honey': [
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80'
  ],
  'Tea-time Snacks': [
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80'
  ],
  'Chocolates & Sweets': [
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80'
  ],
  'Tea & Coffee': [
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'
  ],
  'Juices & Soda': [
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80'
  ],
  'Milk, Butter & Cheese': [
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
  ],
  'Frozen Items': [
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80'
  ],
  'Cleaning & Laundry': [
    'https://images.unsplash.com/photo-1610589165981-2f2c753c79a0?w=600&auto=format&fit=crop&q=80'
  ],
  'Household Cleansers': [
    'https://images.unsplash.com/photo-1610589165981-2f2c753c79a0?w=600&auto=format&fit=crop&q=80'
  ],
  'Tissue & Foil': [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
  ],

  // --- BEAUTY ---
  'Facial Cares': [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'
  ],
  'Moisturizers': [
    'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&auto=format&fit=crop&q=80'
  ],
  'Sun Protection': [
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80'
  ],
  'Lip Care': [
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80'
  ],
  'Face Makeup': [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
  ],
  'Eye Makeup': [
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80'
  ],
  'Lip Makeup': [
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80'
  ],
  'Nail Arts': [
    'https://images.unsplash.com/photo-1604654894610-df4906b110a3?w=600&auto=format&fit=crop&q=80'
  ],
  'Shampoo & Conditioners': [
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80'
  ],
  'Hair Treatments': [
    'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80'
  ],
  'Hair Styling': [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
  ],
  'Soaps & Bodywash': [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80'
  ],
  'Oral Hygiene': [
    'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&auto=format&fit=crop&q=80'
  ],
  'Sanitary & Pads': [
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80'
  ],
  'Perfumes & Attar': [
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80'
  ],
  'Beard care & Shave': [
    'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80'
  ],
  'Diapers & Wipes': [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'
  ],
  'Skin Lotions & Oils': [
    'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80'
  ],
  'Formula Milk & Cereals': [
    'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80'
  ],
  'Learning & Puzzles': [
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80'
  ],
  'RC Cars & Hardware': [
    'https://images.unsplash.com/photo-1559281361-291167cccaf7?w=600&auto=format&fit=crop&q=80'
  ],
  'Dolls & Soft Toys': [
    'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80'
  ],
  'Strollers & Walkers': [
    'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80'
  ]
};

const getSpecificImageForFeature = (stdCat: string, featureEn: string, i: number): string => {
  const normFeature = featureEn.toLowerCase();
  
  for (const key of Object.keys(SPECIFIC_IMAGES_BY_FEATURE)) {
    const normKey = key.toLowerCase();
    if (normFeature.includes(normKey) || normKey.includes(normFeature)) {
      const arr = SPECIFIC_IMAGES_BY_FEATURE[key];
      return arr[i % arr.length];
    }
  }

  // Handle special Saree case
  if (normFeature.includes('saree') || normFeature.includes('sari')) {
    const sarees = [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'
    ];
    return sarees[i % sarees.length];
  }

  const fallbackList = IMAGES_BY_CAT[stdCat] || IMAGES_BY_CAT['গ্যাজেটস (Gadgets)'];
  return fallbackList[i % fallbackList.length];
};

const CATEGORY_NAMES_MAP: Record<string, { bn: string; en: string }> = {
  'গ্যাজেটস (Gadgets)': { bn: 'গ্যাজেটস', en: 'Gadgets' },
  'ফ্যাশন (Fashion)': { bn: 'ফ্যাশন', en: 'Fashion' },
  'মেন্স ফ্যাশন (Men\'s Fashion)': { bn: 'মেন্স ফ্যাশন', en: "Men's Fashion" },
  'হোম ও কিচেন (Home & Kitchen)': { bn: 'হোম ও কিচেন', en: 'Home & Kitchen' },
  'গ্রোসারি (Grocery)': { bn: 'গ্রোসারি', en: 'Grocery' },
  'বিউটি ও কেয়ার (Beauty Care)': { bn: 'বিউটি ও কেয়ার', en: 'Beauty Care' }
};

const EN_ADJECTIVES = [
  'Premium', 'Elite', 'Luxury', 'Classic', 'Exclusive', 'Smart', 'Organic', 'Pure', 'Dynamic', 'Aesthetic',
  'Original', 'Comfort', 'High-Grade', 'Modern', 'Supreme', 'Absolute', 'Essential', 'Ultra', 'Royal', 'Handcrafted'
];

const BN_ADJECTIVES = [
  'প্রিমিয়াম', 'এলিট', 'লাক্সারি', 'কালের সেরা', 'এক্সক্লুসিভ', 'স্মার্ট', 'অর্গানিক', 'খাঁটি', 'ডাইনামিক', 'নান্দনিক',
  'অরিজিনাল', 'আরামদায়ক', 'হাই-গ্রেড', 'আধুনিক', 'সুপ্রীম', 'নিখাদ', 'প্রয়োজনীয়', 'আল্ট্রা', 'রয়্যাল', 'হস্তশিল্পের'
];

const EN_NOUNS = [
  'Choice', 'Selection', 'Pack', 'Edition', 'Collection', 'Plus', 'Series', 'Vibe', 'Pro', 'Max'
];

const BN_NOUNS = [
  'চয়েস', 'সিলেকশন', 'প্যাক', 'সংস্করণ', 'কালেকশন', 'প্লাস', 'সিরিজ', 'ভাইব', 'প্রো', 'ম্যাক্স'
];

const BASE_PRICES: Record<string, number> = {
  'গ্যাজেটস (Gadgets)': 1200,
  'ফ্যাশন (Fashion)': 1500,
  'মেন্স ফ্যাশন (Men\'s Fashion)': 1350,
  'হোম ও কিচেন (Home & Kitchen)': 2200,
  'গ্রোসারি (Grocery)': 450,
  'বিউটি ও কেয়ার (Beauty Care)': 650
};

// Helper to clean up category suffixes for product search tags
const cleanTextTags = (text: string): string => {
  if (!text) return '';
  return text.replace(/^[০-৯\d]+[\.\s\-]+/g, '').replace(/\s*\([^)]*\)/g, '').trim();
};

const populateGeneratedProducts = () => {
  const standardCategories = [
    'গ্যাজেটস (Gadgets)',
    'ফ্যাশন (Fashion)',
    'হোম ও কিচেন (Home & Kitchen)',
    'গ্রোসারি (Grocery)',
    'বিউটি ও কেয়ার (Beauty Care)'
  ];

  standardCategories.forEach((stdCat, catIdx) => {
    // 1. Count existing products of this category is INITIAL_PRODUCTS
    const existing = INITIAL_PRODUCTS.filter(p => p.category === stdCat);
    const existingCount = existing.length;
    const itemsNeeded = 50 - existingCount;

    if (itemsNeeded <= 0) return;

    // 2. Discover all targets (subcategories and sub-subcategories) inside NESTED_CATEGORIES for this category
    const targets: { subEn: string; subBn: string; subsubEn?: string; subsubBn?: string }[] = [];
    NESTED_CATEGORIES.forEach(pc => {
      if (pc.mappedCategory === stdCat) {
        pc.subcategories.forEach(sub => {
          if (sub.subSubcategories && sub.subSubcategories.length > 0) {
            sub.subSubcategories.forEach(ss => {
              targets.push({
                subEn: cleanTextTags(sub.nameEn),
                subBn: cleanTextTags(sub.nameBn),
                subsubEn: cleanTextTags(ss.nameEn),
                subsubBn: cleanTextTags(ss.nameBn)
              });
            });
          } else {
            targets.push({
              subEn: cleanTextTags(sub.nameEn),
              subBn: cleanTextTags(sub.nameBn)
            });
          }
        });
      }
    });

    if (targets.length === 0) {
      targets.push({ subEn: 'General', subBn: 'সাধারণ' });
    }

    // 3. Generate products
    for (let i = 0; i < itemsNeeded; i++) {
      const target = targets[i % targets.length];
      const adjIdx = (i * 7) % EN_ADJECTIVES.length;
      const adjEn = EN_ADJECTIVES[adjIdx];
      const adjBn = BN_ADJECTIVES[adjIdx];

      const nounIdx = (i * 3) % EN_NOUNS.length;
      const nounEn = EN_NOUNS[nounIdx];
      const nounBn = BN_NOUNS[nounIdx];

      // Build specific titles containing sub and subsub category names so click-filtering matches instantly
      const featureEn = target.subsubEn || target.subEn;
      const featureBn = target.subsubBn || target.subBn;

      const nameEn = `${adjEn} ${featureEn} ${nounEn} - Spec ${i + 1}`;
      const nameBn = `${adjBn} ${featureBn} ${nounBn} - সংস্করণ ${i + 1}`;

      const generatedId = `gen_p_${catIdx}_${i}`;

      const basePrice = BASE_PRICES[stdCat] || 1000;
      const price = basePrice + ((i * 13) % 20) * 100 + 49;
      const originalPrice = Math.round((price * 1.6) / 50) * 50;
      const stock = 10 + ((i * 11) % 45);
      const rating = parseFloat((4.0 + ((i * 3) % 10) * 0.1).toFixed(1));
      const reviewsCount = 12 + ((i * 17) % 180);

      const image = getSpecificImageForFeature(stdCat, featureEn, i);

      // Description contains search words
      const descriptionEn = `${adjEn} collection of high-grade ${featureEn}. This premium item offers unparalleled modern quality, design durability, and lightweight comfort designed for perfect daily usage. Rated highly by industry experts.`;
      const descriptionBn = `আকর্ষণীয় ও উন্নত ডিজাইনের এই ${featureBn} দৈনন্দিন যেকোনো ব্যবহারের জন্য সেরা। এটি অত্যন্ত দীর্ঘস্থায়ী, টেকসই ও সাশ্রয়ী মূল্যে প্রিমিয়াম লুক দেয়।`;

      // Push product to standard INITIAL_PRODUCTS list
      INITIAL_PRODUCTS.push({
        id: generatedId,
        name: nameEn,
        category: stdCat,
        price,
        originalPrice,
        image,
        description: descriptionBn, // Default storage
        rating,
        reviewsCount,
        stock,
        images: [
          image
        ]
      });

      // Populate translations map dynamically
      const catMap = CATEGORY_NAMES_MAP[stdCat] || { bn: 'সব', en: 'All' };
      productTranslations[generatedId] = {
        name: {
          bn: nameBn,
          en: nameEn
        },
        category: {
          bn: catMap.bn,
          en: catMap.en
        },
        description: {
          bn: descriptionBn,
          en: descriptionEn
        }
      };
    }
  });
};

const populateExtraTechProducts = () => {
  const techTypes = [
    {
      typeEn: 'Mobile Phone',
      typeBn: 'মোবাইল ফোন',
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1565849906461-0ee21694c72e?w=600&auto=format&fit=crop&q=80'
      ],
      basePrice: 15000,
      adjEn: ['Smart', 'Flagship', 'Pro Gaming', 'Ultra Thin', 'Mega Power', 'Dynamic Screen', 'Super Fast'],
      adjBn: ['স্মার্ট', 'ফ্ল্যাগশিপ', 'প্রো গেমিং', 'আল্ট্রা স্লিম', 'মেগা পাওয়ার', 'নান্দনিক স্ক্রিন', 'সুপার ফাস্ট']
    },
    {
      typeEn: 'Laptop',
      typeBn: 'ল্যাপটপ',
      images: [
        'https://images.unsplash.com/photo-1496181130204-755241544e35?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&auto=format&fit=crop&q=80'
      ],
      basePrice: 42000,
      adjEn: ['Premium Thin', 'High Performance Gaming', 'Elite Business', 'Aesthetic Notebook', 'Next-Gen Workstation', 'Compact Creator', 'Pro Developer'],
      adjBn: ['প্রিমিয়াম স্লিম', 'হাই পারফরম্যান্স গেমিং', 'এলিট বিজনেস', 'নান্দনিক নোটবুক', 'নেক্সট-জেন ওয়ার্কস্টেশন', 'ক্রিয়েটর স্পেশাল', 'প্রো ডেভেলপার']
    },
    {
      typeEn: 'Keyboard',
      typeBn: 'কিবোর্ড',
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1626260962721-f09b5550a256?w=600&auto=format&fit=crop&q=80'
      ],
      basePrice: 1500,
      adjEn: ['RGB Mechanical', 'Wireless Compact', 'Silent Click Multitasking', 'Ergonomic Premium', 'Backlit Gaming', 'Bluetooth Travel', 'Ultra Durability'],
      adjBn: ['আরজিবি মেকানিক্যাল', 'ওয়্যারলেস কম্প্যাক্ট', 'সাইলেন্ট ক্লিক মাল্টিটাস্কিং', 'এরগনোমিক প্রিমিয়াম', 'ব্যাকলিট গেমিং', 'ব্লুটুথ ট্রাভেল', 'দীর্ঘস্থায়ী টেকসই']
    },
    {
      typeEn: 'Mouse',
      typeBn: 'মাউস',
      images: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1625842268584-8f329044697c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1613560641154-184be5e36fe5?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1628144510877-3e818817a151?w=600&auto=format&fit=crop&q=80'
      ],
      basePrice: 850,
      adjEn: ['USB Optical', 'Rechargeable Wireless', 'High Precision Precision', 'Ergonomic Vertical', 'Silent Dual-Mode', 'RGB Honeycomb Gaming', 'Compact Travel'],
      adjBn: ['ইউএসবি অপটিক্যাল', 'রিচার্জেবল ওয়্যারলেস', 'হাই প্রিসিশন', 'এরগনোমিক ভার্টিকাল', 'সাইলেন্ট ডুয়াল-মোড', 'আরজিবি হানিকম্ব গেমিং', 'কম্প্যাক্ট ট্রাভেল']
    }
  ];

  for (let i = 0; i < 250; i++) {
    const tech = techTypes[i % techTypes.length];
    const image = tech.images[(i + 3) % tech.images.length];
    
    // Pick adjective
    const adjIdx = Math.floor(i / techTypes.length) % tech.adjEn.length;
    const aEn = tech.adjEn[adjIdx];
    const aBn = tech.adjBn[adjIdx];
    
    const countNum = Math.floor(i / techTypes.length) + 1;
    const nameEn = `${aEn} ${tech.typeEn} - Model T${countNum}`;
    const nameBn = `${aBn} ${tech.typeBn} - মডেল T${countNum}`;
    
    const generatedId = `tech_p_${i}`;
    const price = tech.basePrice + ((i * 23) % 40) * 120 + 99;
    const originalPrice = Math.round((price * 1.5) / 100) * 100;
    const stock = 20 + ((i * 17) % 50);
    const rating = parseFloat((4.1 + ((i * 9) % 10) * 0.1).toFixed(1));
    const reviewsCount = 15 + ((i * 23) % 300);
    
    const descriptionEn = `High quality, durable and efficient ${tech.typeEn} designed for tech enthusiasts. It features ergonomic design, modern styling, and superior tactile components. Fully tested for reliability and long-term convenience.`;
    const descriptionBn = `প্রযুক্তিপ্রেমীদের জন্য প্রস্তুতকৃত চমৎকার ও টেকসই ${tech.typeBn}। এটি আধুনিক ডিজাইন, সাশ্রয়ী মূল্য এবং দুর্দান্ত কার্যকারিতার সাথে তৈরি করা হয়েছে। দীর্ঘমেয়াদী ব্যবহারের জন্য এটি একটি আদর্শ পছন্দ।`;

    INITIAL_PRODUCTS.push({
      id: generatedId,
      name: nameEn,
      category: 'গ্যাজেটস (Gadgets)',
      price,
      originalPrice,
      image,
      description: descriptionBn,
      rating,
      reviewsCount,
      stock,
      images: [
        image
      ]
    });

    productTranslations[generatedId] = {
      name: {
        bn: nameBn,
        en: nameEn
      },
      category: {
        bn: 'গ্যাজেটস',
        en: 'Gadgets'
      },
      description: {
        bn: descriptionBn,
        en: descriptionEn
      }
    };
  }
};

const populateMensFashionProducts = () => {
  const productsList = [
    {
      nameEn: 'Premium Cotton Casual Shirt',
      nameBn: 'প্রিমিয়াম কটন ক্যাজুয়াল শার্ট',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
      descEn: 'Premium lightweight combed cotton casual shirt for ultimate daily comfort.',
      descBn: 'দৈনন্দিন আরাম ও স্টাইলিশ লুকের জন্য প্রিমিয়াম লাইটওয়েট কম্বড কটন ক্যাজুয়াল শার্ট।'
    },
    {
      nameEn: 'Slim Fit Denim Jeans',
      nameBn: 'স্লিম ফিট ডেনিম জিন্স',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
      descEn: 'Classic stretchable denim jeans with rugged detailing and premium comfort.',
      descBn: 'ক্লাসিক ব্লু কালার স্ট্রেচেবল ডেনিম জিন্স প্যান্ট, দীর্ঘস্থায়ী ব্যবহারের জন্য অত্যন্ত আরামদায়ক।'
    },
    {
      nameEn: 'Export Quality Polo Shirt',
      nameBn: 'এক্সপোর্ট কোয়ালিটি পোলো শার্ট',
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
      descEn: '100% organic cotton polo shirt with rich stitching and durable color.',
      descBn: '১০০% অরগানিক সুতি কাপড়ে তৈরি এক্সপোর্ট কোয়ালিটি আরামদায়ক পোলো শার্ট।'
    },
    {
      nameEn: 'Designer Semi-Formal Panjabi',
      nameBn: 'ডিজাইনার সেমি-ফরমাল পাঞ্জাবি',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=80',
      descEn: 'Elegant designer panjabi with minimalist embroidery on neck and cuffs.',
      descBn: 'গলা এবং হাতায় সূক্ষ্ম এমব্রয়ডারি করা চমৎকার ডিজাইনার সেমি-ফরমাল পাঞ্জাবি।'
    },
    {
      nameEn: 'Genuine Leather Derby Shoe',
      nameBn: 'জেনুইন লেদার ডার্বি জুতো',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80',
      descEn: 'Handcrafted genuine leather derby shoes, perfect for professional settings.',
      descBn: 'অফিস বা যেকোনো ফরমাল অনুষ্ঠানের জন্য জেনুইন লেদার দ্বারা চমৎকারভাবে তৈরি ডার্বি জুতো।'
    },
    {
      nameEn: 'Stylish Casual Blazer',
      nameBn: 'স্টাইলিশ ক্যাজুয়াল ব্লেজার',
      image: 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=600&auto=format&fit=crop&q=80',
      descEn: 'Modern slim-cut formal blazer featuring elegant lapels and a comfort lining.',
      descBn: 'আধুনিক স্লিম-ফিট ফরমাল বা ক্যাজুয়াল ব্লেজার, যা যেকোনো পোশাকে আনে অনন্য স্মার্টনেস।'
    },
    {
      nameEn: 'Polarized Sports Sunglasses',
      nameBn: 'পোলারাইজড স্পোর্টস সানগ্লাস',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
      descEn: 'UV400 protected polarized sunglasses with ultra-light durable frame.',
      descBn: 'রোদ ও ক্ষতিকারক আল্ট্রাভায়োলেট রশ্মি থেকে ১০০% সুরক্ষা দিতে আকর্ষণীয় সানগ্লাস।'
    },
    {
      nameEn: 'Slim Bifold Leather Wallet',
      nameBn: 'স্লিম বাইফোল্ড লেদার মানিব্যাগ',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
      descEn: 'Minimalist genuine leather wallet with RFID blocking layer and card slots.',
      descBn: 'জেনুইন লেদার দিয়ে তৈরি স্লিম এবং আকর্ষণীয় বাইফোল্ড মানিব্যাগ।'
    },
    {
      nameEn: 'Premium Linen Casual Shirt',
      nameBn: 'প্রিমিয়াম লিনেন ক্যাজুয়াল শার্ট',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
      descEn: 'Breathable linen shirt for premium hot-weather fashion.',
      descBn: 'গরম বালির মধ্যে আরাম পেতে চমৎকার ব্রিদএবল ও সুতি লিনেন ক্যাজুয়াল শার্ট।'
    },
    {
      nameEn: 'Classic Leather Belt',
      nameBn: 'ক্লাসিক লেদার বেল্ট',
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
      descEn: 'Smooth genuine full-grain leather belt for formals and casuals.',
      descBn: 'ফরমাল বা ক্যাজুয়াল যেকোনো ব্যবহারের উপযোগী দীর্ঘস্থায়ী জেনুইন লেদার কুপলিং বেল্ট।'
    }
  ];

  const colorsEn = ['Navy Blue', 'Charcoal Grey', 'Olive Green', 'Maroon Red', 'Premium White', 'Jet Black', 'Tan Brown'];
  const colorsBn = ['নেভি ব্লু', 'চারকোল গ্রে', 'অলিভ গ্রিন', 'মেরুন রেড', 'প্রিমিয়াম হোয়াইট', 'জেট ব্ল্যাক', 'ট্যান্ট ব্রাউন'];

  for (let i = 0; i < 50; i++) {
    const baseProduct = productsList[i % productsList.length];
    const colorIdx = (i * 3) % colorsEn.length;
    
    const nameEn = `${baseProduct.nameEn} - ${colorsEn[colorIdx]} (Edition ${Math.floor(i / productsList.length) + 1})`;
    const nameBn = `${baseProduct.nameBn} - ${colorsBn[colorIdx]} (সংস্করণ ${Math.floor(i / productsList.length) + 1})`;
    
    const generatedId = `mens_p_${i}`;
    const price = 450 + ((i * 31) % 25) * 150 + 90;
    const originalPrice = Math.round((price * 1.5) / 50) * 50;
    const stock = 15 + ((i * 7) % 40);
    const rating = parseFloat((4.2 + ((i * 7) % 9) * 0.1).toFixed(1));
    const reviewsCount = 5 + ((i * 12) % 150);

    INITIAL_PRODUCTS.push({
      id: generatedId,
      name: nameEn,
      category: 'মেন্স ফ্যাশন (Men\'s Fashion)',
      price,
      originalPrice,
      image: baseProduct.image,
      description: baseProduct.descBn,
      rating,
      reviewsCount,
      stock,
      images: [
        baseProduct.image
      ]
    });

    productTranslations[generatedId] = {
      name: {
        bn: nameBn,
        en: nameEn
      },
      category: {
        bn: 'মেন্স ফ্যাশন',
        en: "Men's Fashion"
      },
      description: {
        bn: baseProduct.descBn,
        en: baseProduct.descEn
      }
    };
  }
};

populateGeneratedProducts();
populateExtraTechProducts();
populateMensFashionProducts();
