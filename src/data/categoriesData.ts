export interface SubSubcategory {
  nameBn: string;
  nameEn: string;
}

export interface Subcategory {
  nameBn: string;
  nameEn: string;
  subSubcategories?: SubSubcategory[];
}

export interface ParentCategory {
  id: string;
  nameBn: string;
  nameEn: string;
  mappedCategory: string; // Maps to internal standard category
  icon: string; // Emoji
  subcategories: Subcategory[];
}

export const NESTED_CATEGORIES: ParentCategory[] = [
  {
    id: 'fashion_apparel',
    nameBn: "১. মহিলাদের এবং মেয়েদের ফ্যাশন (Women's & Girls' Fashion)",
    nameEn: "1. Women's & Girls' Fashion",
    mappedCategory: 'ফ্যাশন (Fashion)',
    icon: '👗',
    subcategories: [
      {
        nameBn: 'ব্যাগস (Bags)',
        nameEn: 'Bags',
        subSubcategories: [
          { nameBn: 'ওয়ালেটস (Wallets)', nameEn: 'Wallets' },
          { nameBn: 'টোট ব্যাগস (Tote Bags)', nameEn: 'Tote Bags' },
          { nameBn: 'ল্যাপটপ ও ব্যাকপ্যাক (Backpacks)', nameEn: 'Backpacks' },
          { nameBn: 'হ্যান্ডব্যাগ এবং পার্স (Handbags & Purses)', nameEn: 'Handbags & Purses' },
          { nameBn: 'ক্লাচ ও রিস্টলেট (Clutches & Wristlets)', nameEn: 'Clutches & Wristlets' }
        ]
      },
      {
        nameBn: 'ক্লোথিং (Clothing)',
        nameEn: 'Clothing',
        subSubcategories: [
          { nameBn: 'কটন শাড়ি (Cotton Saree)', nameEn: 'Cotton Saree' },
          { nameBn: 'সিল্ক শাড়ি (Silk Saree)', nameEn: 'Silk Saree' },
          { nameBn: 'জামদানি শাড়ি (Jamdani Saree)', nameEn: 'Jamdani Saree' },
          { nameBn: 'প্রিন্টেড শাড়ি (Printed Saree)', nameEn: 'Printed Saree' },
          { nameBn: 'ব্রাইডাল শাড়ি (Bridal Saree)', nameEn: 'Bridal Saree' }
        ]
      },
      {
        nameBn: 'শিশুদের ফ্যাশন (Kids & Babies)',
        nameEn: 'Kids & Babies Fashion',
        subSubcategories: [
          { nameBn: 'ছেলেদের ফ্যাশন (শার্ট, টি-শার্ট, প্যান্ট, ডেনিম, পাঞ্জাবি, কো-অর্ড সেট)', nameEn: 'Boys Fashion' },
          { nameBn: 'মেয়েরদের ফ্যাশন (ফ্রক, পার্টি গাউন, স্কার্ট, লেগিংস, থ্রি-পিস, টপস)', nameEn: 'Girls Fashion' },
          { nameBn: 'নিউ-বর্ন ও ইনফ্যান্ট (বেবি রমপার্স, ওয়ানসি, মিটেনস, বুটিজ, ড্রেসিং সেট)', nameEn: 'Newborn & Infant' }
        ]
      },
      {
        nameBn: 'পাদুকা ও জুতো (Footwear Industry)',
        nameEn: 'Footwear Industry',
        subSubcategories: [
          { nameBn: 'পুরুষদের জুতো (ফরমাল লেদার শু, স্নিকার্স, রানিং/স্পোর্টস শু, লোফার, বুট, স্যান্ডেল)', nameEn: 'Men\'s Shoes' },
          { nameBn: 'মহিলাদের জুতো (হাই হিল, ওয়েজেস, ফ্ল্যাট স্যান্ডেল, ব্যালেরিনা, স্নিকার্স, জুতি, পার্টি শু)', nameEn: 'Women\'s Shoes' },
          { nameBn: 'বাচ্চাদের জুতো (এলইডি শু, স্কুল শু, ক্যাজুয়াল স্যান্ডেল)', nameEn: 'Kids Shoes' }
        ]
      }
    ]
  },
  {
    id: 'consumer_electronics',
    nameBn: '২. কনজিউমার ইলেকট্রনিক্স ও আইটি (Consumer Electronics & Computing)',
    nameEn: '2. Consumer Electronics & IT',
    mappedCategory: 'গ্যাজেটস (Gadgets)',
    icon: '💻',
    subcategories: [
      {
        nameBn: 'স্মার্টফোন ও পরিধানযোগ্য ডিভাইস (Mobile & Wearables)',
        nameEn: 'Mobile & Wearables',
        subSubcategories: [
          { nameBn: 'মোবাইল ফোন (অ্যান্ড্রয়েড স্মার্টফোন, আইফোন/iOS, বাটন/ফিচার ফোন)', nameEn: 'Mobile Phones' },
          { nameBn: 'ট্যাবলেট (আইপ্যাড, অ্যান্ড্রয়েড ট্যাবলেট, গ্রাফিক্স ট্যাবলেট/ড্রয়িং প্যাড)', nameEn: 'Tablets' },
          { nameBn: 'স্মার্ট উইয়ারেবলস (স্মার্টওয়াচ, ফিটনেস ট্র্যাকার, ভিআর বক্স)', nameEn: 'Smart Wearables' }
        ]
      },
      {
        nameBn: 'ল্যাপটপ ও পার্সোনাল কম্পিউটার (Laptops & Desktops)',
        nameEn: 'Laptops & Desktops',
        subSubcategories: [
          { nameBn: 'ল্যাপটপ (নোটবুক, গেমিং ল্যাপটপ, আল্ট্রাবুক, ম্যাকবুক)', nameEn: 'Laptops' },
          { nameBn: 'ডেস্কটপ পিসি (ব্র্যান্ড পিসি, কাস্টম বিল্ট গেমিং পিসি, অল-ইন-ওয়ান পিসি)', nameEn: 'Desktops' }
        ]
      },
      {
        nameBn: 'কম্পিউটার পেরিফেরালস ও উপাদান (Accessories)',
        nameEn: 'Computer Components',
        subSubcategories: [
          { nameBn: 'কোর পার্টস (প্রসেসর, মাদারবোর্ড, র্যাম, গ্রাফিক্স কার্ড, এসএসডি/হার্ডডিস্ক, পাওয়ার সাপ্লাই, কেসিং)', nameEn: 'Core Components' },
          { nameBn: 'ইনপুট/আউটপুট (মনিটর, মেকানিক্যাল কীবোর্ড, গেমিং মাউস, ওয়েবক্যাম, সাউন্ড সিস্টেম)', nameEn: 'Input / Output' },
          { nameBn: 'নেটওয়ার্কিং (ওয়াইফাই রাউটার, সুইচ, ল্যান ক্যাবল, রেঞ্জ এক্সটেন্ডার, পকেট রাউটার)', nameEn: 'Networking Solutions' },
          { nameBn: 'অফিস ইকুইপমেন্ট (প্রিন্টার, স্ক্যানার, ফটোকপি মেশিন, প্রজেক্টর, বারকোড স্ক্যানার, ইউপিএস)', nameEn: 'Office Equipment' }
        ]
      },
      {
        nameBn: 'অডিও, ভিডিও ও এন্টারটেইনমেন্ট (Audio & Video)',
        nameEn: 'Audio & Video',
        subSubcategories: [
          { nameBn: 'পোর্টেবল অডিও (ইয়ারবাডস/TWS, ব্লুটুথ হেডফোন, নেকব্যান্ড, পোর্টেবল স্পিকার)', nameEn: 'Portable Audio' },
          { nameBn: 'হোম অডিও (সাউন্ডবার, হোম থিয়েটার সিস্টেম, স্পিকার ক্যাবিনেট)', nameEn: 'Home Audio' },
          { nameBn: 'স্ট্রিমিং ও রেকর্ডিং (ইউটিউবার মেগা কিট, কন্ডেন্সার মাইক্রোফোন, সাউন্ড কার্ড, ক্যাপচার কার্ড)', nameEn: 'Streaming Gear' }
        ]
      },
      {
        nameBn: 'স্টোরেজ ও মেমোরি (Storage Devices)',
        nameEn: 'Storage Devices',
        subSubcategories: [
          { nameBn: 'পেনড্রাইভ, মেমোরি কার্ড, এক্সটার্নাল হার্ডডিস্ক, ওটিজি ড্রাইভ', nameEn: 'Flash & External Storage' }
        ]
      },
      {
        nameBn: 'ফটোগ্রাফি ও অপটিক্স (Photography & Drones)',
        nameEn: 'Photography & Drones',
        subSubcategories: [
          { nameBn: 'ক্যামেরা (DSLR, মিররলেস ক্যামেরা, অ্যাকশন ক্যামেরা, ইনস্ট্যান্ট ক্যামেরা)', nameEn: 'Cameras' },
          { nameBn: 'ক্যামেরা গিয়ার (লেন্স, ট্রাইপড, গিম্বল, রিং লাইট, ফ্ল্যাশ, ড্রোন)', nameEn: 'Camera Gears' }
        ]
      }
    ]
  },
  {
    id: 'tv_home_appliances',
    nameBn: '৩. স্মার্ট হোম, টিভি ও গৃহস্থালী যন্ত্রপাতি (Smart Home & Large Appliances)',
    nameEn: '3. Smart Home, TV & Appliances',
    mappedCategory: 'হোম ও কিচেন (Home & Kitchen)',
    icon: '📺',
    subcategories: [
      {
        nameBn: 'টেলিভিশন ও আনুষঙ্গিক (Television System)',
        nameEn: 'Television Systems',
        subSubcategories: [
          { nameBn: 'এলইডি টিভি, ৪কে ইউএইচডি স্মার্ট টিভি, অ্যান্ড্রয়েড টিভি, ওলেড/কিউলেড টিভি, টিভি ওয়াল মাউন্ট, অ্যান্ড্রয়েড টিভি বক্স', nameEn: 'Smart & LED TVs' }
        ]
      },
      {
        nameBn: 'রান্নাঘরের মেগা অ্যাপ্লায়েন্স (Large Kitchen)',
        nameEn: 'Large Kitchen Appliances',
        subSubcategories: [
          { nameBn: 'রেফ্রিজারেটর (ডিপ ফ্রিজ, ডাবল ডোর ফ্রিজ, সাইড-বাই-সাইড ফ্রিজ, মিনি ফ্রিজ)', nameEn: 'Refrigerators' },
          { nameBn: 'ওভেন (মাইক্রোওয়েভ ওভেন, কনভেকশন ওভেন, ওটিজি ইলেকট্রিক ওভেন)', nameEn: 'Ovens & OTGs' },
          { nameBn: 'কিচেন হুড, চিমনি, গ্যাস স্টোভ (গ্যাস চুলো), ইন্ডাকশন ও ইনফ্রারেড কুকার', nameEn: 'Cookers & Hoods' }
        ]
      },
      {
        nameBn: 'লন্ড্রি ও হোম ইউটিলিটি (Home Utility)',
        nameEn: 'Laundry & Home Utility',
        subSubcategories: [
          { nameBn: 'ওয়াশিং মেশিন (ফ্রন্ট লোড, টপ লোড, সেমি-অটোমেটিক, ড্রায়ার)', nameEn: 'Washing Machines' },
          { nameBn: 'এয়ার কন্ডিশনার (এসি - ইনভার্টার, নন-ইনভার্টার, ক্যাসেট এসি, পোর্টেবল এসি)', nameEn: 'Air Conditioners' },
          { nameBn: 'রুম হিটার, গিজার ও ওয়াটার হিটার, এয়ার পিউরিফায়ার, ডিহিউমিডিফায়ার', nameEn: 'Heaters & Purifiers' },
          { nameBn: 'ক্লিনিং গ্যাজেট (ভ্যাকিউম ক্লিনার, রোবোটিক ভ্যাকিউম, স্টিম মপ)', nameEn: 'Vacuum Cleaners' }
        ]
      },
      {
        nameBn: 'স্মার্ট ও ছোট কিচেন গ্যাজেট (Small Kitchen)',
        nameEn: 'Small Kitchen Appliances',
        subSubcategories: [
          { nameBn: 'ব্লেন্ডার, গ্রাইন্ডার, মিক্সার, জুসার, ফুড প্রসেসর', nameEn: 'Blenders & Grinders' },
          { nameBn: 'রাইস কুকার, প্রেসার কুকার, মাল্টি-কুকার, রুটি মেকার', nameEn: 'Rice & Pressure Cookers' },
          { nameBn: 'ইলেকট্রিক কেটলি, কফি মেকার, টোস্টার, স্যান্ডউইচ মেকার, এয়ার ফ্রায়ার', nameEn: 'Kettles & Fryers' },
          { nameBn: 'ওয়াটার পিউরিফায়ার (RO ফিল্টার, আল্ট্রাফিল্ট্রেশন, ডিশওয়াশার)', nameEn: 'Water Purifiers' }
        ]
      },
      {
        nameBn: 'ব্যক্তিগত যত্ন অ্যাপ্লায়েন্স (Personal Care)',
        nameEn: 'Personal Care Appliances',
        subSubcategories: [
          { nameBn: 'হেয়ার ড্রায়ার, হেয়ার স্ট্রেইটনার, কার্লার, পুরুষদের ট্রিমার ও শেভার, ট্রিমার কিট', nameEn: 'Grooming Devices' }
        ]
      }
    ]
  },
  {
    id: 'furniture_decor',
    nameBn: '৪. হোম ফার্নিচার ও লিভিং সজ্জা (Furniture, Living & Smart Home)',
    nameEn: '4. Home Furniture & Living',
    mappedCategory: 'হোম ও কিচেন (Home & Kitchen)',
    icon: '🛏️',
    subcategories: [
      {
        nameBn: 'আসবাবপত্র ও ফার্নিচার (Furniture)',
        nameEn: 'Home Furniture',
        subSubcategories: [
          { nameBn: 'লিভিং রুম ফার্নিচার (সোফা সেট, সেন্টার টেবিল, টিভি কেবিনেট, ডিভান, জুতো রাখার র্যাক)', nameEn: 'Living Room Furniture' },
          { nameBn: 'বেডরুম ফার্নিচার (খাট/বেড, আলমারি, ওয়ার্ডরোব, ড্রেসিং টেবিল, বেডসাইড টেবিল)', nameEn: 'Bedroom Furniture' },
          { nameBn: 'ডাইনিং ও কিচেন (ডাইনিং টেবিল সেট, ডিনার ওয়াগন, কিচেন কেবিনেট)', nameEn: 'Dining room Furniture' },
          { nameBn: 'স্টাডি ও অফিস ফার্নিচার (কম্পিউটার টেবিল, রিডিং ডেস্ক, এক্সিকিউটিভ চেয়ার, বুকশেলফ)', nameEn: 'Study & Office Furniture' }
        ]
      },
      {
        nameBn: 'হোম টেক্সটাইল ও বেডিং (Home Textiles)',
        nameEn: 'Home Textiles & Bedding',
        subSubcategories: [
          { nameBn: 'বেডরুম টেক্সটাইল (বেডশিট/বিছানার চাদর, কমফোর্টার, কম্বল, তোশক, ম্যাট্রেস, বালিশ, কুশন কভার)', nameEn: 'Bedding & Pillows' },
          { nameBn: 'উইন্ডো ও ডোর (ডিজাইনার পর্দা, পর্দার রড, ব্লাইন্ডস)', nameEn: 'Curtains & Blinds' },
          { nameBn: 'বাথ টেক্সটাইল (বাথ টাওয়েল/তোয়ালে, বাথরোব, ফুটম্যাট)', nameEn: 'Bath Towels & Mats' }
        ]
      },
      {
        nameBn: 'হোম ডেকর ও লাইটিং (Home Decor)',
        nameEn: 'Home Decor & Lighting',
        subSubcategories: [
          { nameBn: 'অলংকরণ (ওয়াল ক্লক, থ্রিডি পেইন্টিং, ফ্রেমেড আর্ট, ফ্লোর ভ্যাস, কৃত্রিম গাছপালা, শোপিস)', nameEn: 'Aesthetics & Wall Art' },
          { nameBn: 'লাইটিং সリューション (ঝারবাতি, এলইড স্ট্রিপ লাইট, টেবিল ল্যাম্প, নাইট লাইট, সোলার লাইট)', nameEn: 'Lighting Solutions' },
          { nameBn: 'সুগন্ধি (সেন্ট্রেড ক্যান্ডেল, ডিফিউজার ও এসেনশিয়াল অয়েল)', nameEn: 'Candles & Diffusers' }
        ]
      },
      {
        nameBn: 'রান্নাঘরের পাত্র ও ডাইনিং (Cookware)',
        nameEn: 'Cookware & Dining',
        subSubcategories: [
          { nameBn: 'কুকওয়্যার (নন-স্টিক ফ্রাইপ্যান, কড়াই, সসপ্যান, প্রেশার কুকার, ক্যাসারোল)', nameEn: 'Pots & Pans' },
          { nameBn: 'ডাইনিং ও টেবিলওয়্যার (কাচের ও সিরামিকের ডিনার সেট, প্লেট, বাটি, চামচ সেট, ওয়াটার পট)', nameEn: 'Plates & Dinner sets' },
          { nameBn: 'কিচেন টুলস (ছুরি সেট, কাটিং বোর্ড, মশলার কৌটা, টিফের বক্স, ফ্লাস্ক ও থার্মাস)', nameEn: 'Kitchen Utensils' }
        ]
      }
    ]
  },
  {
    id: 'groceries_fresh',
    nameBn: '৫. মেগা গ্রোসারি, সুপারশপ ও ফুড (Mega Grocery & Fresh Food)',
    nameEn: '5. Mega Grocery & Food',
    mappedCategory: 'গ্রোসারি (Grocery)',
    icon: '🍏',
    subcategories: [
      {
        nameBn: 'নিত্যপ্রয়োজনীয় রান্নার উপাদান (Baking & Cooking)',
        nameEn: 'Baking & Cooking Essentials',
        subSubcategories: [
          { nameBn: 'চাল, ডাল, আটা, ময়দা, সুজি, চিনি, লবণ', nameEn: 'Rice, Flour & Sugars' },
          { nameBn: 'ভোজ্য তেল ও ফ্যাট (সয়াবিন তেল, সরিষার তেল, অলিভ অয়েল, ঘি, মাখন)', nameEn: 'Oils & Fats' },
          { nameBn: 'মশলা সামগ্রী (গুঁড়ো মশলা, আস্ত গরম মশলা, আদা-রসুন পেস্ট, রান্নার রেডি মিক্স)', nameEn: 'Spices & Pastes' }
        ]
      },
      {
        nameBn: 'ফ্রেশ ও অর্গানিক ফুড (Fresh Produce)',
        nameEn: 'Fresh Produce',
        subSubcategories: [
          { nameBn: 'ফরমালিন মুক্ত ফলমূল ও শাকসবজি', nameEn: 'Fresh Fruits & Vegetables' },
          { nameBn: 'তাজা মাছ, মাংস (গরু, খাসি, মুরগি), ডিম', nameEn: 'Fresh Fish & Meat' }
        ]
      },
      {
        nameBn: 'প্যাকেটজাত ও ঝটপট খাবার (Packaged)',
        nameEn: 'Packaged Foods',
        subSubcategories: [
          { nameBn: 'নুডলস, পাস্তা, ম্যাকারোনি, স্যুপ, সিরিয়াল, ওটস', nameEn: 'Instant Noodles & Soups' },
          { nameBn: 'সস, ক্যাচআপ, মেয়োনিজ, সালাদ ড্রেসিং, ভিনেগার, আচার, জ্যাম, জেলি, মধু', nameEn: 'Condiments & Honey' },
          { nameBn: 'স্ন্যাক্স (বিস্কুট, কুকিজ, চিপস, চানাচুর, পপকর্ন, ক্র্যাকার্স)', nameEn: 'Tea-time Snacks' },
          { nameBn: 'সুইটস (ডার্ক চকলেট, ক্যান্ডি, চুইংগাম, ডেজার্ট মিক্স)', nameEn: 'Chocolates & Sweets' }
        ]
      },
      {
        nameBn: 'পানীয় ও বেভারেজ (Beverages)',
        nameEn: 'Beverages',
        subSubcategories: [
          { nameBn: 'গরম পানীয় (চা পাতা, গ্রিন টি, ব্ল্যাক কফি, কফি বিনস, হট চকলেট)', nameEn: 'Tea & Coffee' },
          { nameBn: 'কোল্ড ড্রিংকস (সফট ড্রিংকস, জুস, স্কোয়াশ, এনার্জি ড্রিংকস, মিনারেল ওয়াটার)', nameEn: 'Juices & Soda' }
        ]
      },
      {
        nameBn: 'ডেইরি ও ফ্রোজেন ফুড (Dairy & Frozen)',
        nameEn: 'Dairy & Frozen Foods',
        subSubcategories: [
          { nameBn: 'তরল ও গুঁড়ো দুধ, কনডেন্সড মিল্ক, পনির/চীজ, হুইপড ক্রিম, টক দই', nameEn: 'Milk, Butter & Cheese' },
          { nameBn: 'ফ্রোজেন স্ন্যাক্স (নাগেটস, ফ্রেঞ্চ ফ্রাই, সিঙ্গারা, সমুচা, পরোটা, সসেজ, আইসক্রিম)', nameEn: 'Frozen Items' }
        ]
      },
      {
        nameBn: 'লন্ড্রি ও হোম কেয়ার (Laundry & Cleaning)',
        nameEn: 'Cleaning & Laundry',
        subSubcategories: [
          { nameBn: 'লন্ড্রি (ডিটারজেন্ট পাউডার, লিকুইড ডিটারজেন্ট, ফেব্রিক সফটনার, কাপড়ের নীল)', nameEn: 'Laundry care' },
          { nameBn: 'ঘর পরিষ্কার (ফ্লোর ক্লিনার, টয়লেট ক্লিনার, গ্লাস ক্লিনার, ডিশওয়াশিং বার)', nameEn: 'Household Cleansers' },
          { nameBn: 'পেস্ট কন্ট্রোল (মশা মারার স্প্রে ও কয়েল, অ্যারোসল, তেলাপোকার চক)', nameEn: 'Mosquito & Pest' },
          { nameBn: 'ডিসপোজেবল (টিস্যু পেপার, টয়লেট রোল, ফয়েল পেপার, আবর্জনার ব্যাগ)', nameEn: 'Tissue & Foil' }
        ]
      }
    ]
  },
  {
    id: 'beauty_cosmetics',
    nameBn: '৬. বিউটি, কসমেটিক্স ও পার্সোনাল কেয়ার (Beauty, Luxury Cosmetics & Grooming)',
    nameEn: '6. Beauty, Cosmetics & Grooming',
    mappedCategory: 'বিউটি ও কেয়ার (Beauty Care)',
    icon: '💄',
    subcategories: [
      {
        nameBn: 'স্কিন কেয়ার (Premium Skin Care)',
        nameEn: 'Premium Skin Care',
        subSubcategories: [
          { nameBn: 'ফেসিয়াল কেয়ার (ফেসওয়াশ, স্ক্রাব, টোনার, সিরাম, এসেন্স, শীট মাস্ক, ফেসপ্যাক)', nameEn: 'Facial Cares' },
          { nameBn: 'ময়েশ্চারাইজেশন (ডে ক্রিম, নাইট ক্রিম, বডি লোশন, বডি বাটার, অ্যালোভেরা জেল)', nameEn: 'Moisturizers' },
          { nameBn: 'সান প্রোটেকশন (সানস্ক্রিন জেল, সান স্প্রে, ম্যাট সানস্ক্রিন)', nameEn: 'Sun Protection' },
          { nameBn: 'লিপ কেয়ার (লিপবাম, লিপ স্ক্রাব, লিপ ওয়েল)', nameEn: 'Lip Care' }
        ]
      },
      {
        nameBn: 'মেকআপ ও কসমেটিক্স (Color Cosmetics)',
        nameEn: 'Color Makeup',
        subSubcategories: [
          { nameBn: 'ফেস মেকআপ (প্রাইমার, ফাউন্ডেশন, কনসিলার, ফেস পাউডার, বিবি/সিসি ক্রিম, ব্লাশ)', nameEn: 'Face Makeup' },
          { nameBn: 'আই মেকআপ (কাজল, আইলাইনার, মাসকারা, আইশ্যাডো প্যালেট, আইব্রো পেন্সিল)', nameEn: 'Eye Makeup' },
          { nameBn: 'লিপ মেকআপ (ম্যাট লিপস্টিক, লিকুইড লিপস্টিক, লিপ লাইনার, লিপ গ্লস)', nameEn: 'Lip Makeup' },
          { nameBn: 'নেইল কেয়ার (নেইলপলিশ, নেইলপলিশ রিমুভার, নেইল আর্ট কিট)', nameEn: 'Nail Arts' }
        ]
      },
      {
        nameBn: 'হেয়ার কেয়ার ও স্টাইলিং (Hair Care Solutions)',
        nameEn: 'Hair Care Solutions',
        subSubcategories: [
          { nameBn: 'ক্লিনজিং (শ্যাম্পু, অ্যান্টি-ড্যান্ড্রাফ শ্যাম্পু, কন্ডিশনার, হেয়ার মাস্ক)', nameEn: 'Shampoo & Conditioners' },
          { nameBn: 'ট্রিটমেন্ট (হেয়ার অয়েল, হেয়ার গ্রোথ সিরাম, অনিয়ন অয়েল)', nameEn: 'Hair Treatments' },
          { nameBn: 'স্টাইলিং (হেয়ার জেল, ওয়াক্স, হেয়ার স্প্রে, হেয়ার কালার/মেহেদি)', nameEn: 'Hair Styling' }
        ]
      },
      {
        nameBn: 'পার্সোনাল হাইজিন ও বাথ (Personal Hygiene)',
        nameEn: 'Personal Hygiene',
        subSubcategories: [
          { nameBn: 'বডি ওয়াশ, বিউটি সোপ/সাবান, বডি স্ক্রাব, হ্যান্ডওয়াশ, স্যানিটাইজার', nameEn: 'Soaps & Bodywash' },
          { nameBn: 'ওরাল কেয়ার (টুথপেস্ট, ইলেকট্রিক টুথব্রাশ, মাউথওয়াশ, ডেন্টাল ফ্লস)', nameEn: 'Oral Hygiene' },
          { nameBn: 'মেয়েদের হাইজিন (স্যানিটারি প্যাড, প্যান্টি লাইনার, মেনস্ট্রুয়াল কাপ)', nameEn: 'Sanitary & Pads' },
          { nameBn: 'সুগন্ধি (লাক্সারি পারফিউম, বডি স্প্রে, ডিওডোরেন্ট রোলন, আতর ও উদ)', nameEn: 'Perfumes & Attar' }
        ]
      },
      {
        nameBn: 'পুরুষদের বিশেষ গ্রুমিং (Men\'s Grooming)',
        nameEn: 'Men\'s Grooming',
        subSubcategories: [
          { nameBn: 'বিয়ার্ড অয়েল (দাড়ির তেল), শেভিং ক্রিম, আফটার শেভ লোশন, রেজার ও ব্লেড', nameEn: 'Beard care & Shave' }
        ]
      }
    ]
  },
  {
    id: 'baby_care',
    nameBn: '৭. মা, নবজাতক ও শিশু যত্ন (Baby Care, Toys & Maternity)',
    nameEn: '7. Baby Care, Toys & Maternity',
    mappedCategory: 'বিউটি ও কেয়ার (Beauty Care)',
    icon: '👶',
    subcategories: [
      {
        nameBn: 'ডায়াপারিং ও হাইজিন (Diapering & Wipes)',
        nameEn: 'Diapering & Wipes',
        subSubcategories: [
          { nameBn: 'বেবি ডায়াপার (প্যান্ট স্টাইল, টেপ স্টাইল, ক্লথ ডায়াপার), বেবি ওয়াইপস, ডায়াপার র্যাশ ক্রিম', nameEn: 'Diapers & Wipes' }
        ]
      },
      {
        nameBn: 'শিশুর স্কিনকেয়ার (Baby Skin Care)',
        nameEn: 'Baby Skin Care',
        subSubcategories: [
          { nameBn: 'বেবি লোশন, বেবি অয়েল, বেবি পাউডার, নো-টিয়ার শ্যাম্পু, বেবি সোপ, ম্যাসাজ অয়েল', nameEn: 'Skin Lotions & Oils' }
        ]
      },
      {
        nameBn: 'বেবি ফিডিং ও খাদ্য (Baby Feeding & Food)',
        nameEn: 'Baby Feedings & Foods',
        subSubcategories: [
          { nameBn: 'শিশু খাদ্য (ইনফ্যান্ট ফর্মুলা মিল্ক, সেরিল্যাক, ওটস, বেবি পিউরি, হেলথ ড্রিংকস)', nameEn: 'Formula Milk & Cereals' },
          { nameBn: 'ফিডিং গিয়ার (ফিডিং বোতল, ব্রেস্ট পাম্প, বোতল স্টেরিলাইজার, নিপল, চুষনি, বেবি বিবস)', nameEn: 'Feeding Bottles & Gears' }
        ]
      },
      {
        nameBn: 'বেবি গিয়ার ও ট্রাভেল (Baby Gear)',
        nameEn: 'Baby Gear & Travel',
        subSubcategories: [
          { nameBn: 'বেবি স্ট্রোলার (বাচ্চা হাঁটার গাড়ি), প্র্যাম, বেবি ওয়াকার, কার সিট, বেবি ক্যারিয়ার ব্যাগ, দোলনা', nameEn: 'Strollers & Walkers' }
        ]
      },
      {
        nameBn: 'খেলনা ও বিনোদন (Toys & Games)',
        nameEn: 'Toys & Kids Games',
        subSubcategories: [
          { nameBn: 'আর্লি লার্নিং (পাজল, বিল্ডিং ব্লকস, ফ্লাশ কার্ড, কাইনমেটিক স্যান্ড, ড্রয়িং বোর্ড)', nameEn: 'Learning & Puzzles' },
          { nameBn: 'রিমোট কন্ট্রোল ও ইলেকট্রনিক্স (আরসি কার, ড্রোন, রোবট, কিডস ট্যাবলেট)', nameEn: 'RC Cars & Hardware' },
          { nameBn: 'আউটডোর ও রাইড-অন (বাচ্চাদের সাইকেল, ট্রাইসাইকেল, কিক স্কুটার, সুইমিং পুল)', nameEn: 'Skaters & Cycles' },
          { nameBn: 'পুতুল ও সফট টয়েজ (টেডি বিয়ার, বার্বি ডল, অ্যাকশন ফিগার)', nameEn: 'Dolls & Soft Toys' }
        ]
      }
    ]
  },
  {
    id: 'health_pharmacy',
    nameBn: '৮. স্বাস্থ্য, মেডিকেল ও ফিটনেস (Health, Pharmacy & Fitness)',
    nameEn: '8. Health, Pharmacy & Fitness',
    mappedCategory: 'বিউটি ও কেয়ার (Beauty Care)',
    icon: '🏥',
    subcategories: [
      {
        nameBn: 'ওভার দ্য কাউন্টার (OTC) ও মেডিকেল সাপ্লাই (Medical Supplies)',
        nameEn: 'OTC & First Aid',
        subSubcategories: [
          { nameBn: 'ফার্স্ট এইড (ব্যান্ডেজ, স্যাভলন, গজ, অ্যান্টিসেপ্টিক ক্রিম, ফার্স্ট এইড বক্স)', nameEn: 'Bandage & Antiseptic' },
          { nameBn: 'সেফটি (সার্জিক্যাল মাস্ক, কেএন৯৫ মাস্ক, হ্যান্ড গ্লাভস, পিপিই)', nameEn: 'Protective Masks & Gloves' },
          { nameBn: 'কনট্রাসেপティブ ও ফ্যামিলি প্ল্যানিং (কনডম, পিল)', nameEn: 'Contraceptives' }
        ]
      },
      {
        nameBn: 'হেলথ মনিটরিং ডিভাইস (Health Monitors)',
        nameEn: 'Health Monitors',
        subSubcategories: [
          { nameBn: 'ডিজিটাল প্রেশার মাপার মেশিন, গ্লুকোমিটার (ডায়াবেটিস টেস্ট কিট), থার্মোমিটার, পালস অক্সিমিটার, নেবুলাইজার, ওয়েট স্কেল', nameEn: 'Pressure & Diabetes tools' }
        ]
      },
      {
        nameBn: 'নিউট্রিশন ও সাপ্লিমেন্ট (Nutritional Supplements)',
        nameEn: 'Nutritional Supplements',
        subSubcategories: [
          { nameBn: 'ফিটনেস সাপ্লিমেন্ট (ওয়ে প্রোটিন, ক্রিয়েটিন, BCAA, মাস গেইনার)', nameEn: 'Whey Protein & Creatine' },
          { nameBn: 'ভিটামিন ও মিনারেলস (মাল্টিভিটামিন, ওমেগা-৩ ফিশ অয়েল, ক্যালসিয়াম, ভিটামিন সি, কোলাজেন)', nameEn: 'Vitamins & Collegen' },
          { nameBn: 'ভেষজ ও আয়ুর্বেদিক (কালিজিরা তেল, অ্যাপল সাইডার ভিনেগার, ইসবগুলের ভুষি, চিরতা গুঁড়ো)', nameEn: 'Herbal Remedies' }
        ]
      },
      {
        nameBn: 'ফিটনেস ও জিম ইকুইপমেন্ট (Gym & Fitness)',
        nameEn: 'Gym & Fitness Gears',
        subSubcategories: [
          { nameBn: 'হোম জিম (ডাম্বেল সেট, পুশ-আপ বার, রেজিস্ট্যান্স ব্যান্ড, অ্যাব রোলার, ট্রেইনিং গ্লাভস)', nameEn: 'Dumbbells & Bands' },
          { nameBn: 'যোগব্যায়াম (ইয়োগা ম্যাট, ইয়োগা ব্লক, স্কিপিং রোপ/লাফ দড়ি)', nameEn: 'Yoga & Skipping ropes' },
          { nameBn: 'হেভি মেশিনারি (ট্রেডমিল, এক্সারসাইজ বাইক)', nameEn: 'Treadmills' }
        ]
      }
    ]
  },
  {
    id: 'sports_outdoor',
    nameBn: '৯. খেলাধুলা ও আউটডোর (Sports, Outdoor & Adventure)',
    nameEn: '9. Sports & Outdoor Adventure',
    mappedCategory: 'ফ্যাশন (Fashion)',
    icon: '⚽',
    subcategories: [
      {
        nameBn: 'টিম স্পোর্টস গিয়ার (Team Sports)',
        nameEn: 'Team Sports Gear',
        subSubcategories: [
          { nameBn: 'ক্রিকেট (লেদার ও টেপ টেনিস ব্যাট, বল, প্যাড, গ্লাভস, হেলমেট, স্ট্যাম্প, ক্রিকেট কিট ব্যাগ)', nameEn: 'Cricket Accessories' },
          { nameBn: 'ফুটবল (ফুটবল, গোলকিপার গ্লাভস, শিন গার্ড, পাম্পার)', nameEn: 'Football Equipment' },
          { nameBn: 'র্যাকেট স্পোর্টস (ব্যাডমিন্টন র্যাকেট, শাটলকক, নেট, টেনিস ও টেবিল টেনিস সেট)', nameEn: 'Rackets & Badminton' }
        ]
      },
      {
        nameBn: 'ইনডোর গেমস (Indoor Sports)',
        nameEn: 'Indoor Games',
        subSubcategories: [
          { nameBn: 'ক্যারম বোর্ড ও স্ট্রাইকার, দাবা (চেস বোর্ড), লুডু, প্লেইং কার্ডস, ডার্ট বোর্ড', nameEn: 'Carrom, Chess & Boardgames' }
        ]
      },
      {
        nameBn: 'সাইক্লিং (Cycling)',
        nameEn: 'Cycling Gear',
        subSubcategories: [
          { nameBn: 'মাউন্টেন বাইক (MTB), গিয়ার সাইকেল, স্কুল সাইকেল, হেলমেট, সাইক্লিং গ্লাভস, সাইকেল লাইট ও লক', nameEn: 'Cycles & Accessories' }
        ]
      },
      {
        nameBn: 'ক্যাম্পিং, ট্র্যাকিং ও অ্যাডভেঞ্চার (Camping & Hiking)',
        nameEn: 'Camping & Hiking',
        subSubcategories: [
          { nameBn: 'ক্যাম্পিং টেন্ট (তাঁবু), স্লিপিং ব্যাগ, ট্র্যাকিং পোল/লাঠি, হাইকিং ব্যাকপ্যাক, কম্পাস, পকেট নাইভস', nameEn: 'Tents & Sleeping Bags' }
        ]
      }
    ]
  },
  {
    id: 'books_school',
    nameBn: '১০. বই, স্টেশনারি ও অফিস সাপ্লাই (Books & Stationery Mega Shop)',
    nameEn: '10. Books & Stationery Megastore',
    mappedCategory: 'হোম ও কিচেন (Home & Kitchen)',
    icon: '📚',
    subcategories: [
      {
        nameBn: 'মেগা বুক স্টোর (Books)',
        nameEn: 'Mega Bookstore',
        subSubcategories: [
          { nameBn: 'সাহিত্য (উপন্যাস, গল্পগ্রন্থ, কবিতা, অনুবাদ বই, সায়েন্স ফিকশন)', nameEn: 'Literature & Fiction' },
          { nameBn: 'ধর্মীয় ও আধ্যাত্মিক (আল-কুরআন, হাদিস, ইসলামিক বই, অন্যান্য ধর্মীয় বই)', nameEn: 'Religious Books' },
          { nameBn: 'ক্যারিয়ার ও স্কিল (বিসিএস ও জব প্রিপারেশন, আইইএলটিএস, ফ্রিল্যান্সিং ও প্রোগ্রামিং বই, আত্মউন্নয়ন)', nameEn: 'Skill Development & BCS' },
          { nameBn: 'একাডেমিক (স্কুল, কলেজ, ইউনিভার্সিটি টেক্সটবুক ও গাইড বই)', nameEn: 'Academic & Guides' },
          { nameBn: 'শিশুদের বই (কমিকস, রূপকথা, ড্রয়িং ও কালারিং বই)', nameEn: 'Kids Comic Books' }
        ]
      },
      {
        nameBn: 'শিক্ষা ও অফিস স্টেশনারি (Stationery)',
        nameEn: 'Stationery & Crafts',
        subSubcategories: [
          { nameBn: 'খাতা ও ডায়েরি (নোটবুক, ডায়েরি, খাতা, আর্ট পেপার, স্কেচবুক)', nameEn: 'Notebooks & Diaries' },
          { nameBn: 'রাইটিং টুলস (বলপেন, জেল পেন, মেটাল সাইন পেন, পেন্সিল, জ্যামিতি বক্স, মার্কার, হাইলাইটার)', nameEn: 'Pens & Pencils' },
          { nameBn: 'আর্ট ও ক্রাফট (জলরং, এক্রিলিক কালার, ক্যানভাস, তুলি, কালার পেন্সিল, আঠা/গ্লু গান, কাঁচি)', nameEn: 'Acrylics & Brush sets' },
          { nameBn: 'অফিস অর্গানাইজার (ফাইল, ফোল্ডার, ক্লিপবোর্ড, ক্যালকুলেটর, পাঞ্চিং মেশিন, স্টেপলার)', nameEn: 'Calculators & Files' }
        ]
      }
    ]
  },
  {
    id: 'automotive_powersports',
    nameBn: '১১. অটোমোটিভ: গাড়ি ও মোটরসাইকেল (Automotive & Powersports)',
    nameEn: '11. Automotive & Powersports',
    mappedCategory: 'গ্যাজেটস (Gadgets)',
    icon: '🏍️',
    subcategories: [
      {
        nameBn: 'মোটরসাইকেল ও স্কুটার (Bikes & Accessories)',
        nameEn: 'Motorcycles & Rider Gears',
        subSubcategories: [
          { nameBn: 'বাইক রাইডার গিয়ার (সার্টিফাইড হেলমেট, রাইডিং জ্যাকেট, গ্লাভস, নি-গার্ড)', nameEn: 'Certified Helmets & Jackets' },
          { nameBn: 'বাইকের যত্ন (ইঞ্জিন অয়েল/মোবিল, চেইন লুব, বাইক শ্যাম্পু ও পলিশ, বাইক কভার)', nameEn: 'Mobil & Engine Oils' },
          { nameBn: 'গ্যাজেট ও পার্টস (বাইক মোবাইল হোল্ডার, জিপিএস ট্র্যাকার, সিকিউরিটি অ্যালার্ম লক, এলইডি হেডলাইট)', nameEn: 'Bikes GPS & Holders' }
        ]
      },
      {
        nameBn: 'গাড়ির অভ্যন্তরীণ ও বাহ্যিক যত্ন (Car Care & Accessories)',
        nameEn: 'Car Cares & Accessories',
        subSubcategories: [
          { nameBn: 'কার ইলেকট্রনিক্স (ড্যাশবোর্ড ক্যামেরা/ড্যাশ ক্যাম, কার ব্লুটুথ রিসিভার, রিভার্স ক্যামেরা, কার স্পিকার)', nameEn: 'Dash Cams & Players' },
          { nameBn: 'ইন্টেরিয়র (কার পারফিউম, সিট কভার, স্টিয়ারিং কভার, ফ্লোর ম্যাট, কুশন)', nameEn: 'Seat Covers & Fresheners' },
          { nameBn: 'কার এক্সটেরিয়র ও টুলস (কার কভার, পোর্টেবল টায়ার ইনফ্লেটর, কার ওয়াশার গান, স্ক্র্যাচ রিমুভার)', nameEn: 'Tire Inflators & Covers' }
        ]
      }
    ]
  },
  {
    id: 'tools_hardware',
    nameBn: '১২. টুলস, হার্ডওয়্যার ও ডিআইওয়াই (Tools, Hardware & DIY)',
    nameEn: '12. Hardware, Tools & DIY',
    mappedCategory: 'হোম ও কিচেন (Home & Kitchen)',
    icon: '🔧',
    subcategories: [
      {
        nameBn: 'হ্যান্ড টুলস ও পাওয়ার টুলস (Power & Hand Tools)',
        nameEn: 'Power & Hand Tools',
        subSubcategories: [
          { nameBn: 'পাওয়ার টুলস (ড্রিল মেশিন, অ্যাঙ্গেল গ্রাইন্ডার, সোল্ডারিং আয়রন, গ্লু গান, স্ক্রু-ড্রাইভার সেট)', nameEn: 'Drills & Grinders' },
          { nameBn: 'হ্যান্ড টুলস (হাতুড়ি, প্লায়ার্স, রেঞ্চ, টেপ মেজারমেন্ট/ফিতা, অ্যান্টি-কাটার)', nameEn: 'Hammers & Wrenches' }
        ]
      },
      {
        nameBn: 'ইলেকট্রিক্যাল ও ফিক্সচার (Electrical & Hardware)',
        nameEn: 'Electricals & Locks',
        subSubcategories: [
          { nameBn: 'মাল্টিপ্লাগ ও এক্সটেনশন কর্ড, সার্কিট ব্রেকার, দরজার লক ও হ্যান্ডেল, গ্লু ও আঠা', nameEn: 'Multiplugs & Hardwares' }
        ]
      },
      {
        nameBn: 'বাগান করা (Gardening Supplies)',
        nameEn: 'Gardening Supplies',
        subSubcategories: [
          { nameBn: 'গাছের বীজ ও টব, বাগানের কাঁচি ও কোদাল, ওয়াটার স্প্রে বোতল, জৈব সার ও মাটি', nameEn: 'Seeds, Pots & Fertilizers' }
        ]
      }
    ]
  },
  {
    id: 'pet_supplies',
    nameBn: '১৩. পোষা প্রাণী ও পশুপাখির সামগ্রী (Pet Supplies Industry)',
    nameEn: '13. Pet Supplies Industry',
    mappedCategory: 'গ্রোসারি (Grocery)',
    icon: '🐱',
    subcategories: [
      {
        nameBn: 'বিড়াল ও কুকুরের যত্ন (Cat & Dog Care)',
        nameEn: 'Cat & Dog Cares',
        subSubcategories: [
          { nameBn: 'ক্যাট ফুড ও ডগ ফুড (ড্রাই ফুড, ওয়েট ফুড, ক্যাট ট্রিটস)', nameEn: 'Dry & Wet Pet Foods' },
          { nameBn: 'পেটস অ্যাক্সেসরিজ (গলার বেল্ট/লিস, ক্যাট লিটার বক্স ও লিটার স্যান্ড, ফিডিং বোল, বিড়ালের খেলনা)', nameEn: 'Belts, Litters & Bowls' },
          { nameBn: 'গ্রুমিং (পেট শ্যাম্পু, নেল কাটার, চিরুনি)', nameEn: 'Grooming brushes' }
        ]
      },
      {
        nameBn: 'অ্যাকোয়ারিয়াম ও পাখি (Fish & Bird Care)',
        nameEn: 'Fish & Bird Cares',
        subSubcategories: [
          { nameBn: 'পাখির খাবার ও খাঁচা, অ্যাকোয়ারিয়াম ফিশ ফুড, ওয়াটার ফিল্টার ও অক্সিজেন পাম্প, লাইভ প্ল্যান্টস', nameEn: 'Aquariums & Birdfoods' }
        ]
      }
    ]
  },
  {
    id: 'gaming_digital',
    nameBn: '১৪. গেমিং, বিনোদন ও ডিজিটাল গুডস (Gaming & Digital Goods)',
    nameEn: '14. Gaming & Digital Goods',
    mappedCategory: 'গ্যাজেটস (Gadgets)',
    icon: '🎮',
    subcategories: [
      {
        nameBn: 'গেমিং কনসোল ও গিয়ার (Gaming Hub)',
        nameEn: 'Gaming Consoles & Gears',
        subSubcategories: [
          { nameBn: 'কনসোল (PlayStation 5, Xbox Series X, Nintendo Switch)', nameEn: 'Consoles (PS5, Switch)' },
          { nameBn: 'গেমিং গিয়ার (গেমিং কন্ট্রোলার/জয়স্টিক, গেমিং হেডসেট, স্টিয়ারিং হুইল)', nameEn: 'Joysticks & Gears' },
          { nameBn: 'ভিডিও গেমস (PS5/PC গেমসের সিডি বা دیجیتাল কোড)', nameEn: 'Game CDs & Digital keys' }
        ]
      },
      {
        nameBn: 'ডিজিটাল গুডস ও ভাউচার (Digital Goods)',
        nameEn: 'Digital Keys & Vouchers',
        subSubcategories: [
          { nameBn: 'গিفت কার্ড (গুগল প্লে, অ্যাপল, নেটফ্লিক্স, স্পোটিফাই ভাউচার, গেম টপ-আপ যেমন: ফ্রি ফায়ার/পাবজি ডায়মন্ড)', nameEn: 'Giftcards & In-game Gems' },
          { nameBn: 'সফটওয়্যার লাইসেন্স (অ্যান্টিভাইরাস কি, উইন্ডোজ ও অফিস অ্যাক্টিভেশন কি)', nameEn: 'Windows & Antiviruses' }
        ]
      }
    ]
  },
  {
    id: 'mens_fashion',
    nameBn: "১৫. পুরুষদের ফ্যাশন ও পোশাক (Men's Fashion & Apparel)",
    nameEn: "15. Men's Fashion & Apparel",
    mappedCategory: 'ফ্যাশন (Fashion)',
    icon: '👔',
    subcategories: [
      {
        nameBn: 'পুরুষদের পোশাক (Men\'s Clothing)',
        nameEn: 'Men\'s Clothing',
        subSubcategories: [
          { nameBn: 'পাঞ্জাবি ও পায়জামা (Panjabi & Pajama)', nameEn: 'Panjabi & Pajama' },
          { nameBn: 'টি-শার্ট ও পোলো (T-Shirts & Polos)', nameEn: 'T-Shirts & Polos' },
          { nameBn: 'ক্যাজুয়াল ও ফরমাল শার্ট (Casual & Formal Shirts)', nameEn: 'Casual & Formal Shirts' },
          { nameBn: 'জিন্স ও গ্যাবার্ডিন প্যান্ট (Jeans & Gabardines)', nameEn: 'Jeans & Gabardines' }
        ]
      }
    ]
  },
  {
    id: 'jewelry_accessories',
    nameBn: '১৬. অলংকার ও লাক্সারি ফ্যাশন অনুষঙ্গ (Jewelry & Accessories)',
    nameEn: '16. Jewelry & Accessories',
    mappedCategory: 'ফ্যাশন (Fashion)',
    icon: '💍',
    subcategories: [
      {
        nameBn: 'মেয়েদের অলংকার ও জুয়েলারি (Jewelry & Ornaments)',
        nameEn: 'Jewelry & Ornaments',
        subSubcategories: [
          { nameBn: 'সোনার প্রলেপযুক্ত গহনা (Gold Plated Ornaments)', nameEn: 'Gold Plated Ornaments' },
          { nameBn: 'রুপা ও এন্টিক মেটাল গহনা (Silver & Antique)', nameEn: 'Silver & Antique' },
          { nameBn: 'আংটি এবং কানের দুল (Rings & Earrings)', nameEn: 'Rings & Earrings' }
        ]
      }
    ]
  },
  {
    id: 'industrial_machinery',
    nameBn: '১৭. পাওয়ার টুলস ও ইন্ডাস্ট্রিয়াল সাপ্লাই (Machinery & Industrial Tools)',
    nameEn: '17. Machinery & Industrial Tools',
    mappedCategory: 'হোম ও কিচেন (Home & Kitchen)',
    icon: '⚙️',
    subcategories: [
      {
        nameBn: 'জেনারেটর ও ওয়াটার পাম্প (Generators & Pumps)',
        nameEn: 'Generators & Pumps',
        subSubcategories: [
          { nameBn: 'পোর্টেবল পেট্রোল জেনারেটর (Portable Generators)', nameEn: 'Portable Generators' },
          { nameBn: 'পানি উত্তোলনের মোটর পাম্প (Water Motor Pumps)', nameEn: 'Water Motor Pumps' }
        ]
      }
    ]
  },
  {
    id: 'musical_instruments',
    nameBn: '১৮. বাদ্যযন্ত্র ও প্রো অডিও গিয়ার (Musical Instruments)',
    nameEn: '18. Musical Instruments & Audio',
    mappedCategory: 'গ্যাজেটস (Gadgets)',
    icon: '🎸',
    subcategories: [
      {
        nameBn: 'তারের ও রিদম বাদ্যযন্ত্র (Acoustic & Rhythm)',
        nameEn: 'Acoustic & Rhythm Instruments',
        subSubcategories: [
          { nameBn: 'অ্যাকোস্টিক গিটার ও ইউকুলেলে (Acoustic Guitars)', nameEn: 'Acoustic Guitars & Ukuleles' },
          { nameBn: 'ক্যাবোট ও পারকাশন ড্রাম (Cajon & Drums)', nameEn: 'Cajons & Percussion' }
        ]
      }
    ]
  },
  {
    id: 'office_solutions',
    nameBn: '১৯. অফিস সলিউশন ও বাল্ক স্টেশনারি (Office Solutions)',
    nameEn: '19. Office Solutions & Bulk Stationery',
    mappedCategory: 'হোম ও কিচেন (Home & Kitchen)',
    icon: '🖨️',
    subcategories: [
      {
        nameBn: 'প্রেজেন্টেশন ও নোটিশ বোর্ড (Display Boards)',
        nameEn: 'Display Plates & Boards',
        subSubcategories: [
          { nameBn: 'ম্যাগনেটিক হোয়াইটবোর্ড (Magnetic Whiteboards)', nameEn: 'Magnetic Whiteboards' },
          { nameBn: 'প্রজেক্টর স্ক্রিন (Projector Screens Layout)', nameEn: 'Projector Screens Setup' }
        ]
      }
    ]
  },
  {
    id: 'arts_crafts_antiques',
    nameBn: '২০. আর্ট, ক্রাফট ও কারুশিল্প সংগ্রহ (Arts, Crafts & Antiques)',
    nameEn: '20. Arts, Crafts & Antiques Collection',
    mappedCategory: 'হোম ও কিচেন (Home & Kitchen)',
    icon: '🎨',
    subcategories: [
      {
        nameBn: 'আর্ট ক্যানভাস ও কাটিং ম্যাট (Painting & Canvas Supplies)',
        nameEn: 'Painting Canvas & Mats',
        subSubcategories: [
          { nameBn: 'অ্যাক্রিলিক কালার ক্যানভাস বোর্ড (Canvas Boards)', nameEn: 'Canvas Boards Acrylic' },
          { nameBn: 'আর্ট তুলি ও মিক্সিং প্যালেট (Paint Brushes)', nameEn: 'Paint Brushes Series' }
        ]
      }
    ]
  },
  {
    id: 'agriculture_farming',
    nameBn: '২১. কৃষি, বীজ ও খামার সামগ্রী (Agriculture & Farming)',
    nameEn: '21. Agriculture & Farming Products',
    mappedCategory: 'গ্রোসারি (Grocery)',
    icon: '🌾',
    subcategories: [
      {
        nameBn: 'হাইব্রিড বীজ ও অর্গানিক সার (Seeds & Organic Fertilizer)',
        nameEn: 'Hybrid Seeds & Organic Fertilizers',
        subSubcategories: [
          { nameBn: 'সবজি ও ফুলের বীজ (Vegetable & Flower Seeds)', nameEn: 'Vegetable & Flower Seeds' },
          { nameBn: 'ভার্মিকম্পোস্ট ও জৈব সার (Organic Fertilizers)', nameEn: 'Organic Fertilizers' }
        ]
      }
    ]
  },
  {
    id: 'travel_luggage',
    nameBn: '২২. ভ্রমণ, ট্রাভেল লাগেজ ও ট্রলি ব্যাগ (Travel & Luggage)',
    nameEn: '22. Travel Accessories & Luggage Trolleys',
    mappedCategory: 'ফ্যাশন (Fashion)',
    icon: '🧳',
    subcategories: [
      {
        nameBn: 'লাগেজ, বক্স ও ট্রলি ব্যাগ (Trolley Cabin Bags)',
        nameEn: 'Trolley Bags & Suitcases',
        subSubcategories: [
          { nameBn: 'ফাইবার ট্রলি ও ট্রাভেল বক্স (Fiber Trolley Bags)', nameEn: 'Fiber Trolley Bags Custom' },
          { nameBn: 'ক্যাব ক্যাজুয়াল ব্যাকপ্যাক (Travel Gym Duffels)', nameEn: 'Travel Duffel Bags' }
        ]
      }
    ]
  },
  {
    id: 'handicrafts_heritage',
    nameBn: '২৩. হস্তশিল্প ও দেশীয় ঐতিহ্য সামগ্রী (Handicrafts & Heritage)',
    nameEn: '23. Traditional Handicrafts & Heritage Items',
    mappedCategory: 'ফ্যাশন (Fashion)',
    icon: '🏺',
    subcategories: [
      {
        nameBn: 'মাটির ও বাঁশের কারুশিল্প (Pottery & Bamboo Crafts)',
        nameEn: 'Clay & Bamboo Crafts',
        subSubcategories: [
          { nameBn: 'ডিজাইনার মাটির টব ও ফুলদানি (Ceramic Clay Pots)', nameEn: 'Clay Pots & Vases' },
          { nameBn: 'বাঁশের তৈরি ঝুড়ি ও ডালা (Handmade Bamboo Baskets)', nameEn: 'Bamboo Baskets & Plates' }
        ]
      }
    ]
  },
  {
    id: 'dream_hangings',
    nameBn: '২৪. ঝুলন্ত সজ্জা ও ডেকোরেটিভ ওয়াল আর্ট (Decorative Hangings)',
    nameEn: '24. Fancy Hanging Dream Catchers & Crafts',
    mappedCategory: 'হোম ও কিচেন (Home & Kitchen)',
    icon: '🎐',
    subcategories: [
      {
        nameBn: 'ইনডোর উইন্ড চাইম ও ঝুলন্ত আর্ট (Indoor Hangings & Windchimes)',
        nameEn: 'Decorative Windchimes & Dreamcatchers',
        subSubcategories: [
          { nameBn: 'হাতে বোনা রঙিন ড্রিম ক্যাচার (Colorful Dream Catchers)', nameEn: 'Colorful Dream Catchers' },
          { nameBn: 'বাঁশ ও মেটালের ঝুলন্ত উইন্ডচাইম (Wind Chimes)', nameEn: 'Scenic Metal Windchimes' }
        ]
      }
    ]
  }
];
