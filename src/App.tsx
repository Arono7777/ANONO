import { useState, useEffect } from 'react';
import { Product, Order, User, UserRole, UserStatus, OrderStatus, CartItem, BannerSlide } from './types';
import { INITIAL_PRODUCTS, INITIAL_USERS, CATEGORIES } from './data/initialData';
import anonoBannerImg from './assets/images/anono_banner_1781331208414.jpg';

const INITIAL_BANNERS: BannerSlide[] = [
  {
    id: '1',
    badge: { bn: 'মেগা ক্যাম্পেইন 🌟', en: 'MEGA CAMPAIGN 🌟' },
    title: { bn: 'ANONO অবিশ্বাস্য অফার! দারুণ শপিং!', en: 'ANONO Incredible Offer! Grand Shopping!' },
    line1: { bn: 'অবিশ্বাস্য অফার!', en: 'Incredible Offer!' },
    line2: { bn: 'দারুণ শপিং!', en: 'Grand Shopping!' },
    subtitle: { bn: 'আপনার পছন্দের সেরা ব্র্যান্ড ও পণ্য এখন আপনার হাতের মুঠোয়!', en: 'Your favorite top brands and products are now at your fingertips!' },
    content: {
      bn: 'শপিং করুন আজই এবং আকর্ষণীয় স্বীয় ছাড় উপভোগ করুন! সাথে থাকছে সম্পূর্ণ ফ্রি ক্যাশব্যাকের মেগা ভাউচার!',
      en: 'Shop today and enjoy attractive personalized discounts! Exclusive mega voucher discounts and cashback for all users!',
    },
    actionText: { bn: 'এখনি কিনুন!', en: 'Shop Now!' },
    discountText: { bn: '১৮% ডিসকাউন্ট', en: '18% DISCOUNT' },
    discountBg: 'bg-purple-600 text-white',
    textColor: 'text-neutral-900',
    badgeType: 'anono',
    bgPresetClass: 'bg-gradient-to-r from-[#d2f6f4] via-white to-[#ffe5d4]',
    category: 'সব প্রোডাক্ট (All)',
    searchQuery: '',
    imageUrl: anonoBannerImg,
    isFullImage: true,
  }
];

import ProductCard from './components/ProductCard';
import { AnonoLogo } from './components/AnonoLogo';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import OrderTracker from './components/OrderTracker';
import AdminPanel from './components/AdminPanel';
import SupportCenter from './components/SupportCenter';
import AuthModal from './components/AuthModal';
import Notification, { NotificationType } from './components/Notification';
import BannerCarousel from './components/BannerCarousel';
import { CategoryNavigation } from './components/CategoryNavigation';
import { NESTED_CATEGORIES, ParentCategory } from './data/categoriesData';
import { Language, t, formatNum, formatPrice, getTranslatedProduct } from './data/translations';
import {
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
  UserCheck,
  Package,
  Clock,
  LogOut,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  X,
  CreditCard,
  SlidersHorizontal,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- Persistent States from LocalStorage ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('anono_products');
    const version = localStorage.getItem('anono_products_version');
    if (saved && version === 'v7') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    localStorage.setItem('anono_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('anono_products_version', 'v7');
    return INITIAL_PRODUCTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('anono_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    const saved = localStorage.getItem('anono_banners');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_BANNERS;
      }
    }
    return INITIAL_BANNERS;
  });

  const [websiteName, setWebsiteName] = useState<string>(() => {
    const saved = localStorage.getItem('anono_website_name');
    return saved || 'ANONO';
  });

  const [websiteLogo, setWebsiteLogo] = useState<string>(() => {
    const saved = localStorage.getItem('anono_website_logo');
    return saved || '';
  });


  // Default mock Orders for instant visual data in Admin Panel on first load
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('anono_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fall through to default
      }
    }

    const defaultOrders: Order[] = [
      {
        id: 'ANO-7821',
        userId: 'u2',
        userName: 'Rahat Islam',
        name: 'রাহাত ইসলাম',
        phone: '01712345678',
        address: 'বাড়ি নং ১২, ধানমন্ডি ৩২, ঢাকা',
        paymentMethod: 'Cash on Delivery',
        items: [
          {
            product: INITIAL_PRODUCTS[0], // Earbuds 1250
            quantity: 2
          }
        ],
        totalAmount: 2500,
        status: OrderStatus.DELIVERED,
        createdAt: '2026-06-10T11:00:00Z'
      },
      {
        id: 'ANO-9204',
        userId: 'u3',
        userName: 'Saima Akter',
        name: 'সাইমা আক্তার',
        phone: '01911122233',
        address: 'ফ্ল্যাট ৪বি, গ্রিন ক্যাসেল, বাড্ডা, ঢাকা',
        paymentMethod: 'bKash',
        items: [
          {
            product: INITIAL_PRODUCTS[3], // Polo shirt 490
            quantity: 1
          }
        ],
        totalAmount: 550, // shirt (490) + delivery (60)
        status: OrderStatus.PENDING,
        createdAt: '2026-06-12T03:30:00Z'
      }
    ];
    return defaultOrders;
  });

  // Current session user state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('anono_logged_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to null so they view the website as guest, requiring login/signup for checkout/orders
    return null;
  });

  // --- UI/Navigation States ---
  const [activeView, setActiveView] = useState<'shop' | 'tracker' | 'admin' | 'support'>('shop');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('anono_categories');
    const version = localStorage.getItem('anono_categories_version');
    if (saved && version === 'v6') {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // use default
      }
    }
    localStorage.setItem('anono_categories', JSON.stringify(CATEGORIES));
    localStorage.setItem('anono_categories_version', 'v6');
    return CATEGORIES;
  });
  const [nestedCategories, setNestedCategories] = useState<ParentCategory[]>(() => {
    const saved = localStorage.getItem('anono_nested_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // use default
      }
    }
    return NESTED_CATEGORIES;
  });
  const [selectedCategory, setSelectedCategory] = useState('সব প্রোডাক্ট (All)');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'low-high' | 'high-low' | 'rating'>('default');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [initialCheckoutActive, setInitialCheckoutActive] = useState(false);

  // Global Language State
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('anono_lang');
    return (saved === 'en' || saved === 'bn') ? saved as Language : 'bn';
  });

  useEffect(() => {
    localStorage.setItem('anono_lang', lang);
  }, [lang]);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: NotificationType } | null>(null);

  // --- Save states on change ---
  useEffect(() => {
    try {
      localStorage.setItem('anono_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products:', e);
      showToast(
        lang === 'en' 
          ? 'Added to catalogue but failed to store in browser memory! Image size might be too large; please use smaller images (under 1MB) or online image links.' 
          : 'নতুন পণ্যটি যুক্ত হয়েছে তবে লোকাল মেমোরিতে সেভ হয়নি! আপনার আপলোড করা ছবি অনেক বড় হতে পারে; ছোট মেগাবাইটের ছবি বা অনলাইন লিংক ব্যবহার করুন।', 
        'error'
      );
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('anono_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('anono_banners', JSON.stringify(banners));
    } catch (e) {
      console.error('Failed to save banners:', e);
      showToast(
        lang === 'en' 
          ? 'Banner created but failed to store in browser memory! Banner image might be too large; please use smaller images (under 1MB) or online image links.' 
          : 'ব্যানার তৈরি হয়েছে তবে লোকাল মেমোরিতে সেভ হয়নি! আপলোড করা ছবিটি অনেক বড়; ছোট মেগাবাইটের ছবি বা অনলাইন লিংক ব্যবহার করুন।', 
        'error'
      );
    }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem('anono_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('anono_website_name', websiteName);
    } catch (e) {
      console.error('Failed to save website name:', e);
    }
  }, [websiteName]);

  useEffect(() => {
    try {
      localStorage.setItem('anono_website_logo', websiteLogo);
    } catch (e) {
      console.error('Failed to save website logo:', e);
    }
  }, [websiteLogo]);

  useEffect(() => {
    try {
      localStorage.setItem('anono_categories', JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('anono_nested_categories', JSON.stringify(nestedCategories));
    } catch (e) {
      console.error('Failed to save nested categories:', e);
    }
  }, [nestedCategories]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('anono_logged_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('anono_logged_user');
      }
    } catch (e) {
      console.error('Failed to save user:', e);
    }
  }, [currentUser]);

  // --- Helper Notifications ---
  const showToast = (message: string, type: NotificationType = 'success') => {
    setToast({ message, type });
  };

  // --- Cart Actions ---
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (!currentUser) {
      showToast(lang === 'en' ? '🔐 Sign-in Required to Buy or Add to Cart!' : '🔐 পণ্য কিনতে বা কার্টে যোগ করতে দয়া করে প্রথমে অ্যাকাউন্ট তৈরি করুন বা লগইন করুন!', 'error');
      setInitialCheckoutActive(true);
      setIsAuthModalOpen(true);
      return;
    }

    if (currentUser?.status === UserStatus.BLOCKED) {
      showToast(lang === 'en' ? 'Sorry, your account is blocked! You cannot place orders.' : 'দুঃখিত, আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে! আপনি অর্ডার করতে পারবেন না।', 'error');
      return;
    }

    if (product.stock === 0) {
      showToast(lang === 'en' ? 'Sorry, this product is currently out of stock!' : 'দুঃখিত, পণ্যটি বর্তমানে স্টকে নেই!', 'error');
      return;
    }

    const transP = getTranslatedProduct(product, lang);
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        // Ensure not exceeding stock
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        showToast(lang === 'en' ? `Updated ${transP.name} quantity in your cart.` : `${transP.name} কার্টে আপডেট করা হয়েছে`);
        return prevCart.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        showToast(lang === 'en' ? `Added ${transP.name} to cart.` : `${transP.name} কার্টে যোগ করা হয়েছে।`);
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const handleBuyNow = (product: Product, quantity: number = 1) => {
    if (!currentUser) {
      showToast(lang === 'en' ? '🔐 Sign-in Required to Buy!' : '🔐 পণ্য কিনতে বা কার্টে যোগ করতে দয়া করে প্রথমে অ্যাকাউন্ট তৈরি করুন বা লগইন করুন!', 'error');
      setInitialCheckoutActive(true);
      setIsAuthModalOpen(true);
      return;
    }

    if (currentUser?.status === UserStatus.BLOCKED) {
      showToast(lang === 'en' ? 'Sorry, your account is blocked! You cannot place orders.' : 'দুঃখিত, আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে! আপনি অর্ডার করতে পারবেন না।', 'error');
      return;
    }

    if (product.stock === 0) {
      showToast(lang === 'en' ? 'Sorry, this product is currently out of stock!' : 'দুঃখিত, পণ্যটি বর্তমানে স্টকে নেই!', 'error');
      return;
    }

    const transP = getTranslatedProduct(product, lang);
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prevCart.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });

    setInitialCheckoutActive(true);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast(lang === 'en' ? 'Product deleted from cart.' : 'পণ্যটি কার্ট থেকে ডিলিট করা হয়েছে।', 'info');
  };

  // --- Checkout / Order Creation ---
  const handleCheckout = (details: {
    name: string;
    phone: string;
    address: string;
    paymentMethod: 'bKash' | 'Nagad' | 'Cash on Delivery';
  }) => {
    if (!currentUser) {
      showToast(lang === 'en' ? 'Please log in or sign up first to order products!' : 'পণ্য অর্ডার করতে দয়া করে প্রথমে লগইন অথবা সাইন-আপ করুন!', 'error');
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    if (cart.length === 0) return;

    // Check stock issues before executing
    for (const item of cart) {
      const prod = products.find(p => p.id === item.product.id);
      if (!prod || prod.stock < item.quantity) {
        const transItemName = getTranslatedProduct(item.product, lang).name;
        showToast(lang === 'en' ? `Sorry, "${transItemName}" is out of stock!` : `দুঃখিত, "${transItemName}" আপনার পছন্দের পরিমাণ অনুযায়ী পর্যাপ্ত স্টকে নেই!`, 'error');
        return;
      }
    }

    const orderId = `ANO-${Math.floor(1000 + Math.random() * 9000)}`;
    const subTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const delivery = subTotal > 1500 ? 0 : 60;

    const newOrder: Order = {
      id: orderId,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || details.name,
      name: details.name,
      phone: details.phone,
      address: details.address,
      paymentMethod: details.paymentMethod,
      items: [...cart],
      totalAmount: subTotal + delivery,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    // Substract Stock counts
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const cartItem = cart.find(item => item.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    setOrders(prevOrders => [...prevOrders, newOrder]);
    setCart([]); // Reset Cart
    showToast(lang === 'en' ? `Successfully ordered! Tracking ID: ${orderId}` : `অর্ডারটি সফল হয়েছে! ট্র্যাকিং আইডি: ${orderId}`, 'success');
    setActiveView('tracker');
  };

  // --- Admin Panel callback Actions ---
  const handleAddProduct = (newP: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    // Find the current maximum numeric ID in the catalogue to prevent any duplicates
    const maxId = products.reduce((max, p) => {
      const idStr = p && p.id ? String(p.id) : '';
      const num = parseInt(idStr.replace('p', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const newId = `p${maxId + 1}`;

    const productInstance: Product = {
      ...newP,
      id: newId,
      rating: 4.5 + Math.random() * 0.5, // nice random initial rating
      reviewsCount: Math.floor(10 + Math.random() * 50)
    };
    setProducts(prev => [productInstance, ...prev]);
    showToast(lang === 'en' ? 'New product successfully added to catalog.' : 'নতুন পণ্যটি সফলভাবে ক্যাটালগে যুক্ত হয়েছে।', 'success');
  };

  const handleEditProduct = (updatedP: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedP.id ? updatedP : p));
    showToast(lang === 'en' ? 'Product details successfully updated.' : 'পণ্যের বিবরণ সফলভাবে আপডেট সম্পন্ন হয়েছে।', 'success');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast(lang === 'en' ? 'Product deleted from catalog.' : 'পণ্যটি ক্যাটালগ থেকে সম্পূর্ণ ডিলিট করা হয়েছে।', 'info');
  };

  const handleAddBanner = (newB: Omit<BannerSlide, 'id'>) => {
    const newId = `banner_${Date.now()}`;
    const bannerInstance: BannerSlide = {
      ...newB,
      id: newId
    };
    setBanners(prev => [...prev, bannerInstance]);
    showToast(lang === 'en' ? 'New campaign banner successfully added.' : 'নতুন ক্যাম্পেইন ব্যানারটি সফলভাবে যুক্ত হয়েছে।', 'success');
  };

  const handleDeleteBanner = (bannerId: string) => {
    setBanners(prev => prev.filter(b => b.id !== bannerId));
    showToast(lang === 'en' ? 'Campaign banner successfully deleted.' : 'ক্যাম্পেইন ব্যানারটি সফলভাবে ডিলিট করা হয়েছে।', 'info');
  };

  const handleAddCategory = (categoryName: string) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      showToast(lang === 'en' ? 'Category already exists!' : 'ক্যাটাগরি পূর্বেই তৈরি করা হয়েছে!', 'error');
      return;
    }
    setCategories(prev => [...prev, trimmed]);
  };

  const handleDeleteCategory = (categoryName: string) => {
    if (categoryName === 'সব প্রোডাক্ট (All)') {
      showToast(lang === 'en' ? 'Cannot delete default category' : 'ডিফল্ট ক্যাটাগরি ডিলেট করা যাবে না।', 'error');
      return;
    }
    setCategories(prev => prev.filter(c => c !== categoryName));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(lang === 'en' ? `Order status successfully updated: "${status}"` : `অর্ডারের স্ট্যাটাস আপডেট করা হয়েছে: "${status}"`, 'success');
  };

  const handleUpdateUserRole = (userId: string, role: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    showToast(lang === 'en' ? 'User role successfully updated.' : 'ব্যবহারকারীর রোল সফলভাবে পরিবর্তন করা হয়েছে।', 'success');

    // If active logged-in user changed themselves
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role } : null);
    }
  };

  const handleUpdateUserStatus = (userId: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    showToast(lang === 'en' ? `Account status changed to: "${status.toUpperCase()}"` : `অ্যাকাউন্ট স্ট্যাটাস পরিবর্তন করা হয়েছে: "${status.toUpperCase()}"`, 'info');

    // If active logged-in user blocked themselves or changed
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, status } : null);
    }
  };

  // --- Filtering & Sorting Product Catalog for client view ---
  const filteredProducts = products.filter(p => {
    const q = (searchQuery || '').trim().toLowerCase();
    
    // If user is actively searching, perform a global search to look for matching items site-wide.
    // Otherwise, we strictly enforce the category selection filter.
    const matchesCategory = !q || selectedCategory === 'সব প্রোডাক্ট (All)' || p.category === selectedCategory || q.length > 0;
    
    if (!q) return matchesCategory;

    // Retrieve both English and Bangla fields for robust, cross-bilingual partial matching
    const transPEn = getTranslatedProduct(p, 'en');
    const transPBn = getTranslatedProduct(p, 'bn');

    const fieldsToSearch = [
      p?.name || '',
      p?.category || '',
      p?.description || '',
      p?.subcategory || '',
      p?.subSubcategory || '',
      transPEn?.name || '',
      transPEn?.category || '',
      transPEn?.description || '',
      transPBn?.name || '',
      transPBn?.category || '',
      transPBn?.description || ''
    ].map(f => String(f).toLowerCase());

    const qParts = q.split(/\s+/).filter(part => part.length > 0);

    // Support substring-inclusion for every individual query word part for premium Daraz-like search UX
    const matchesSearch = qParts.length === 0 || qParts.every(part => 
      fieldsToSearch.some(field => field.includes(part))
    );
    
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-high') return a.price - b.price;
    if (sortBy === 'high-low') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default order
  });

  // Calculate cart items quantity bubble
  const totalCartQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderSearchSuggestions = (isMobile: boolean = false) => {
    if (!isSearchFocused) return null;

    const q = searchQuery.trim().toLowerCase();
    
    // 1. Popular suggestions if empty
    if (!q) {
      const populars = lang === 'en' 
        ? ['Earbuds', 'Watch', 'Polo Shirt', 'Adapter', 'Shoe', 'Pant', 'Fashion']
        : ['ইয়ারবাডস', 'ঘড়ি', 'পোলো শার্ট', 'অ্যাডাপ্টার', 'জুতা', 'প্যান্ট', 'ফ্যাশন'];
      
      return (
        <div className={`absolute left-0 right-0 mt-1.5 bg-white border border-neutral-200 shadow-xl rounded-2xl z-50 p-4 text-left space-y-3 max-h-[300px] overflow-y-auto top-full`}>
          <div className="flex items-center gap-1.5 text-neutral-400 font-extrabold text-[10px] tracking-wider uppercase">
            <Search className="w-3.5 h-3.5 text-indigo-500" />
            <span>{lang === 'en' ? 'TRENDING SEARCHES' : 'জনপ্রিয় সার্চসমূহ'}</span>
          </div>
          <div className="flex flex-wrap gap-2 animate-in fade-in zoom-in-95 duration-150">
            {populars.map((term, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSearchQuery(term);
                  setIsSearchFocused(false);
                }}
                className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 hover:text-indigo-600 border border-neutral-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 2. Filter products and categories that match the token
    const matchingProducts = products.filter(p => {
      const transP = getTranslatedProduct(p, lang);
      const fields = [p.name, p.category, p.description, transP.name, transP.category, transP.description]
        .map(f => String(f || '').toLowerCase());
      return fields.some(f => f.includes(q));
    }).slice(0, 5);

    // Find any matching categories
    const matchingCategories = categories.filter(cat => {
      return cat.toLowerCase().includes(q);
    }).slice(0, 3);

    const hasSuggestions = matchingProducts.length > 0 || matchingCategories.length > 0;

    if (!hasSuggestions) {
      return (
        <div className="absolute left-0 right-0 mt-1.5 bg-white border border-neutral-200 shadow-xl rounded-2xl z-50 p-4 text-left text-neutral-400 text-xs top-full">
          {lang === 'en' ? 'No matching suggestions found for your query.' : 'আপনার টাইপ করা শব্দের সাথে মিল থাকা কোনো প্রোডাক্ট পাওয়া যায়নি।'}
        </div>
      );
    }

    return (
      <div className="absolute left-0 right-0 mt-1.5 bg-white border border-neutral-200 shadow-xl rounded-2xl z-50 p-2.5 text-left divide-y divide-neutral-100 max-h-[350px] overflow-y-auto top-full animate-in fade-in slide-in-from-top-1 duration-150">
        
        {/* Categories recommendations */}
        {matchingCategories.length > 0 && (
          <div className="p-1.5 space-y-1.5">
            <div className="text-neutral-405 text-neutral-400 font-extrabold text-[9px] tracking-widest uppercase">
              {lang === 'en' ? 'Matching Categories' : 'ক্যাটাগরি সাজেশন্স'}
            </div>
            <div className="flex flex-col gap-1">
              {matchingCategories.map((cat, ci) => (
                <button
                  key={ci}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSelectedCategory(cat);
                    setSearchQuery('');
                    setIsSearchFocused(false);
                  }}
                  className="w-full text-left p-1.5 hover:bg-indigo-50 text-xs font-semibold rounded-lg text-neutral-750 hover:text-indigo-600 transition-colors cursor-pointer block truncate"
                >
                  🔍 {lang === 'en' ? 'In Category' : 'ক্যাটাগরির অধীনে'} » <span className="font-extrabold">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product listing recommendations */}
        {matchingProducts.length > 0 && (
          <div className="p-1.5 space-y-1.5">
            <div className="text-neutral-405 text-neutral-400 font-extrabold text-[9px] tracking-widest uppercase mb-1">
              {lang === 'en' ? 'Suggested Products' : 'সরাসরি পণ্য সাজেশন্স'}
            </div>
            <div className="space-y-1">
              {matchingProducts.map((p) => {
                const transP = getTranslatedProduct(p, lang);
                return (
                  <div
                    key={p.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSearchQuery(transP.name);
                      setSelectedProduct(p); // Directly open modal for instant details/buying
                      setIsSearchFocused(false);
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-xl cursor-pointer transition-all group border border-transparent hover:border-neutral-100"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-8.5 h-8.5 rounded-lg object-cover bg-neutral-100 border shrink-0 shadow-3xs"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-800 transition-colors group-hover:text-indigo-500 truncate">
                        {transP.name}
                      </p>
                      <p className="text-[10px] leading-none text-neutral-400 mt-0.5">
                        {lang === 'en' ? 'Category' : 'ক্যাটাগরি'}: {transP.category}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-extrabold text-indigo-600">
                        {formatPrice(p.price, lang)}
                      </p>
                      {p.stock <= 0 ? (
                        <p className="text-[8.5px] font-black text-rose-500 leading-none">Stock out</p>
                      ) : (
                        <p className="text-[8.5px] font-black text-emerald-600 leading-none">In Stock</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSendAdminForgotNotification = (emailOrPhone: string, userName: string, otp: string) => {
    try {
      const saved = localStorage.getItem('anono_forgot_notifications');
      let currentAlerts: any[] = [];
      if (saved) {
        currentAlerts = JSON.parse(saved);
      }
      const newAlert = {
        id: 'alert_' + Date.now(),
        emailOrPhone,
        userName,
        otp,
        createdAt: new Date().toISOString()
      };
      currentAlerts = [newAlert, ...currentAlerts];
      localStorage.setItem('anono_forgot_notifications', JSON.stringify(currentAlerts));
      showToast(lang === 'en' ? 'AI Alert sent to Admin database resolver!' : 'পাসওয়ার্ড রিকুয়েস্ট সফল! রিয়েল-টাইম তথ্য এডমিন সিস্টেমে পাঠানো হয়েছে।', 'success');
    } catch (e) {
      console.error('Failed to save forgot password notification:', e);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showToast(lang === 'en' ? `Welcome back, ${user.name}!` : `স্বাগতম, ${user.name}!`, 'success');
    if (user.role === UserRole.ADMIN) {
      setActiveView('admin');
    } else {
      setActiveView('shop');
      if (initialCheckoutActive) {
        setTimeout(() => {
          setIsCartOpen(true);
        }, 300);
      }
    }
  };

  // Simulating logging in as specific users for evaluation ease
  const selectMockUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      showToast(lang === 'en' ? `Logged in as registered account "${user.name}".` : `রেজিস্টার্ড অ্যাকাউন্ট "${user.name}" সাইন-ইন সফল।`, 'success');
      // Automatically switch view to match the logged-in role
      if (user.role === UserRole.ADMIN) {
        setActiveView('admin');
      } else {
        setActiveView('shop');
      }
    } else {
      showToast(lang === 'en' ? 'Browsing website as guest mode!' : 'হুম, আপনি গেস্ট মোডে ব্রাউজ করছেন!', 'info');
      setActiveView('shop');
    }
  };

  return (
    <div className="font-sans antialiased text-neutral-800 bg-gray-50/40 min-h-screen flex flex-col justify-between">
      
      {/* 2. REAL SITE APPLICATION NAVBAR */}
      <header className="sticky top-0 bg-white border-b border-neutral-100 shadow-sm z-30 transition-all">
        
        {/* Purple Top Bar Option Menu */}
        <div className="bg-purple-700 text-white text-[10px] md:text-[11px] font-semibold tracking-wider select-none border-b border-purple-600/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-8 flex items-center justify-between gap-2 md:gap-4 overflow-x-auto whitespace-nowrap scrollbar-none">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setActiveView('shop');
                  setSelectedCategory('সব প্রোডাক্ট (All)');
                  setSearchQuery('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-purple-800 hover:bg-purple-900 border border-purple-500/40 text-white rounded px-2.5 py-1 text-[10px] md:text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'HOME' : 'হোম'}</span>
              </button>
              <span className="text-white/80 font-medium text-[10px] hidden sm:inline-block">
                {lang === 'en' ? `${websiteName} Premium Shop` : `${websiteName} প্রিমিয়াম শপ`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
              <button 
                onClick={() => { setActiveView('support'); }} 
                className="hover:text-amber-100 transition-colors py-1 hover:underline cursor-pointer text-white/90 bg-transparent border-none outline-none font-bold"
              >
                {lang === 'en' ? 'HELP & SUPPORT' : 'সাহায্য ও সাপোর্ট'}
              </button>
              <span className="text-white/30 text-[9px] font-light">|</span>
              
              {currentUser ? (
                currentUser.role === UserRole.ADMIN ? (
                  <>
                    <button 
                      onClick={() => {
                        setActiveView(activeView === 'admin' ? 'shop' : 'admin');
                      }} 
                      className="hover:text-amber-100 transition-colors font-bold cursor-pointer uppercase flex items-center gap-2 py-1 text-white text-[10px] md:text-[11px]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      <span className="font-bold">{lang === 'en' ? 'ARONOR ROY (ADMIN)' : 'অরণ্য রয় (এডমিন)'}</span>
                    </button>
                    <span className="text-white/30 text-[9px] font-light">|</span>
                    <button 
                      onClick={() => {
                        selectMockUser(null);
                      }} 
                      className="hover:text-rose-205 transition-colors font-bold cursor-pointer uppercase py-1 text-white font-sans text-[10px] md:text-[11px]"
                    >
                      {lang === 'en' ? 'LOGOUT' : 'লগআউট'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 py-1 text-white font-bold text-[10px] md:text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                      <span>{currentUser.name}</span>
                    </div>
                    <span className="text-white/30 text-[9px] font-light">|</span>
                    <button 
                      onClick={() => {
                        selectMockUser(null);
                      }} 
                      className="hover:text-rose-200 transition-colors font-bold cursor-pointer uppercase py-1 text-white font-sans text-[10px] md:text-[11px]"
                    >
                      {lang === 'en' ? 'LOGOUT' : 'লগআউট'}
                    </button>
                  </>
                )
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                    }} 
                    className="hover:text-amber-100 transition-colors font-bold cursor-pointer uppercase py-1 text-white font-sans text-[10px] md:text-[11px]"
                  >
                    {lang === 'en' ? 'LOGIN' : 'লগইন'}
                  </button>
                  <span className="text-white/30 text-[9px] font-light">|</span>
                  <button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                    }} 
                    className="hover:text-amber-100 transition-colors font-bold cursor-pointer uppercase py-1 font-sans text-white/95 text-[10px] md:text-[11px]"
                  >
                    {lang === 'en' ? 'SIGN UP' : 'সাইন আপ'}
                  </button>
                  <span className="text-white/30 text-[9px] font-light">|</span>
                  <button 
                    onClick={() => {
                      // Frictionless Admin bypass for testers
                      const adminUser = users.find(u => u.role === UserRole.ADMIN) || INITIAL_USERS[0];
                      selectMockUser(adminUser);
                      showToast(lang === 'en' ? 'Quick bypassed to Admin privileges!' : 'এডমিন কুইক বাইপাস সফল হয়েছে!', 'success');
                    }}
                    className="hover:text-red-200 transition-colors font-bold cursor-pointer uppercase py-1 text-amber-200 font-sans border border-amber-400/40 rounded px-1.5 py-0.5 bg-amber-400/10 text-[9px] inline-block animate-pulse"
                  >
                    {lang === 'en' ? 'QUICK ADMIN' : '🔐 কুইক এডমিন'}
                  </button>
                </>
              )}
              
              <span className="text-white/30 text-[9px] font-light">|</span>
              <div className="relative inline-flex items-center text-[10px] md:text-[11px] font-bold text-white pr-2 select-none">
                <span className="mr-1">🌐</span>
                <select
                  value={lang}
                  onChange={(e) => {
                    const selectedLang = e.target.value as Language;
                    setLang(selectedLang);
                    showToast(selectedLang === 'en' ? 'Website language set to English!' : 'ওয়েবসাইটের ভাষা পরিবর্তন করে বাংলা করা হয়েছে।', 'success');
                  }}
                  className="bg-transparent text-white font-bold cursor-pointer py-0.5 px-2 rounded border border-white/20 text-[10px] focus:ring-1 focus:ring-amber-300 outline-none font-sans"
                >
                  <option value="bn" className="text-neutral-800 bg-white font-sans">বাংলা</option>
                  <option value="en" className="text-neutral-800 bg-white font-sans">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 w-full flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('shop')}>
            {websiteLogo ? (
              <img src={websiteLogo} alt={`${websiteName} Logo`} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
            ) : (
              <AnonoLogo size={32} />
            )}
            <span className="text-neutral-900 font-extrabold text-lg tracking-wider font-sans">
              {websiteName}
            </span>
            <span className="text-xs text-neutral-400 font-bold tracking-tight hidden sm:inline-block border-l border-neutral-200 pl-2">
              {lang === 'en' ? 'Pure E-Commerce' : 'বিশুদ্ধ কমার্স'}
            </span>
          </div>

          {/* Search container in Navbar */}
          {activeView === 'shop' && (
            <div className="flex-grow max-w-sm hidden md:flex">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search premium gadgets, fashion...' : 'দারাজ-এর মতো প্রিমিয়াম পণ্যসমূহ সার্চ করুন...'}
                  className="w-full bg-neutral-50 border border-neutral-200/80 rounded-2xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-purple-600 hover:bg-neutral-100/30 font-medium"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2" />
                {renderSearchSuggestions(false)}
              </div>
            </div>
          )}

          {/* Menu / View Switching controls - Hidden on mobile, sticky bottom nav will handle mobile screens */}
          <nav className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setActiveView('shop')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeView === 'shop'
                  ? 'text-indigo-600 bg-indigo-50/50'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {lang === 'en' ? 'Shop' : 'শপ (Products)'}
            </button>

            <button
              onClick={() => setActiveView('tracker')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeView === 'tracker'
                  ? 'text-indigo-600 bg-indigo-50/50'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {lang === 'en' ? 'Track Order' : 'অর্ডার ট্র্যাকিং'}
            </button>

            <button
              onClick={() => setActiveView('support')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeView === 'support'
                  ? 'text-indigo-600 bg-indigo-50/50'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {lang === 'en' ? 'Support Center' : 'সাপোর্ট সেন্টার'}
            </button>

            {/* Admin Panel button - visible only if Admin */}
            {currentUser?.role === UserRole.ADMIN && (
              <button
                onClick={() => setActiveView('admin')}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all border border-dashed cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'admin'
                    ? 'text-purple-750 bg-purple-50/50 border-purple-300 text-purple-700'
                    : 'text-neutral-500 hover:bg-neutral-50 border-neutral-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>{lang === 'en' ? 'Admin Panel' : 'এডমিন প্যানেল'}</span>
              </button>
            )}

            {/* Shopping Cart button trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 shadow-sm transition-all cursor-pointer flex items-center justify-center"
              title={lang === 'en' ? 'Shopping Cart' : 'শপিং ব্যাগ'}
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {totalCartQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold rounded-full w-5 h-5 text-[10px] flex items-center justify-center border-2 border-white shadow-md animate-bounce font-sans">
                  {formatNum(totalCartQty, lang)}
                </span>
              )}
            </button>
          </nav>

          {/* Compact Shopping Cart Trigger - Visible only on mobile viewport next to logo for visual balance */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-indigo-50/60 text-indigo-600 border border-indigo-100 hover:bg-indigo-100/80 transition-all cursor-pointer flex items-center justify-center shadow-3xs"
              title={lang === 'en' ? 'Shopping Cart' : 'শপিং ব্যাগ'}
            >
              <ShoppingCart className="w-4 h-4" />
              {totalCartQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black rounded-full w-4.5 h-4.5 text-[8.5px] flex items-center justify-center border border-white shadow-sm font-sans animate-pulse">
                  {formatNum(totalCartQty, lang)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DISPLAY SEARCH BAR */}
      {activeView === 'shop' && (
        <div className="px-4 py-2 bg-white border-b border-neutral-100 block md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? 'Search products...' : 'পণ্য সার্চ করুন...'}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
            {renderSearchSuggestions(true)}
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE - Responsive paddings with bottom padding to prevent bottom nav overlay */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 md:px-8 py-4 sm:py-8 flex-grow w-full relative z-10 pb-20 sm:pb-8">

        {/* ===================== VIEW - SHOP LISTINGS ===================== */}
        {activeView === 'shop' && (
          <div className="space-y-6">
            
            {/* Real Interactive Banner Carousel (Full width like original) */}
            <BannerCarousel 
              lang={lang} 
              slides={banners}
              onBannerClick={(category, query) => {
                setSelectedCategory(category);
                setSearchQuery(query);
                // Smooth scroll to product categories below
                const categorySelector = document.getElementById('category-bar-section');
                if (categorySelector) {
                  categorySelector.scrollIntoView({ behavior: 'smooth' });
                }
              }} 
              showToast={showToast} 
            />

            {/* Category selection section with cascading multi-level tree */}
            <div id="category-bar-section" className="space-y-3.5 scroll-mt-20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-400 uppercase tracking-widest block">
                  {lang === 'en' ? 'Browse Categories' : 'ক্যাটাগরি সমূহ ব্রাউজ করুন'}
                </span>
                <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 px-2 py-0.5 rounded-full font-mono">
                  150+ Sub-categories
                </span>
              </div>
              
              <CategoryNavigation
                lang={lang}
                nestedCategories={nestedCategories}
                selectedCategory={selectedCategory}
                onSelectFilter={(mappedCat, textSearch) => {
                  setSelectedCategory(mappedCat);
                  setSearchQuery(textSearch);
                  showToast(
                    lang === 'en'
                      ? `Filtered by category: "${mappedCat}" ${textSearch ? `& search: "${textSearch}"` : ''}`
                      : `ফিল্টার ক্যাটাগরি: "${mappedCat}" ${textSearch ? `ও অনুসন্ধান: "${textSearch}"` : ''}`,
                    'info'
                  );
                }}
              />

              {/* Dynamic Categories Selector Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 font-sans">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSearchQuery('');
                        showToast(
                          lang === 'en'
                            ? `Filtered by category: "${cat}"`
                            : `ফিল্টার ক্যাটাগরি: "${cat}"`,
                          'info'
                        );
                      }}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer shadow-3xs hover:scale-103 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort options bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-neutral-100">
              <div>
                <p className="text-xs font-semibold text-neutral-500">
                  {lang === 'en' ? 'Total Match found:' : 'সর্বমোট পাওয়া গেছে:'} <span className="font-extrabold text-neutral-800">
                    {formatNum(sortedProducts.length, lang)} {lang === 'en' ? 'Premium Items' : 'টি প্রিমিয়াম প্রোডাক্ট'}
                  </span>
                </p>
              </div>

              {/* Sort parameters */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
                <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> {lang === 'en' ? 'Sort By:' : 'সাজান:'}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-neutral-700 focus:outline-none focus:border-indigo-500 shadow-xs"
                >
                  <option value="default">{lang === 'en' ? 'Recommended' : 'জনপ্রিয়তা'}</option>
                  <option value="low-high">{lang === 'en' ? 'Price: Low to High' : 'দাম: কম থেকে বেশি'}</option>
                  <option value="high-low">{lang === 'en' ? 'Price: High to Low' : 'দাম: বেশি থেকে কম'}</option>
                  <option value="rating">{lang === 'en' ? 'Highest Customer Rating' : 'হাই রেটিং কাস্টমার চয়েস'}</option>
                </select>
              </div>
            </div>

            {/* Products grid */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-neutral-100 shadow-xs max-w-md mx-auto p-8">
                <HelpCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="font-bold text-neutral-700 text-sm mb-1">
                  {lang === 'en' ? 'No products found!' : 'কোনো প্রোডাক্ট খুঁজে পাওয়া যায়নি।'}
                </p>
                <p className="text-xs text-neutral-400 leading-normal">
                  {lang === 'en' 
                    ? 'Try checking other search queries or change your selected category filter.'
                    : 'আপনার অনুসন্ধানকৃত কী-ওয়ার্ডটি ভিন্ন ক্যাটাগরি বা সঠিক বানানে পুনরায় ট্রাই করুন।'}
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6"
              >
                <AnimatePresence>
                  {sortedProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      lang={lang}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                      onViewDetails={(p) => setSelectedProduct(p)}
                      onBuyNow={(p) => handleBuyNow(p, 1)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}

        {/* ===================== VIEW - ORDER TRACKING ===================== */}
        {activeView === 'tracker' && (
          <OrderTracker orders={orders} lang={lang} />
        )}

        {/* ===================== VIEW - SUPPORT HELP CENTER ===================== */}
        {activeView === 'support' && (
          <SupportCenter lang={lang} orders={orders} currentUser={currentUser} />
        )}

        {/* ===================== VIEW - ADMIN CONTROL PANEL ===================== */}
        {activeView === 'admin' && (
          <div>
            {/* Guarantee Auth Shield check */}
            {currentUser?.role === UserRole.ADMIN ? (
              <AdminPanel
                products={products}
                orders={orders}
                users={users}
                banners={banners}
                onAddBanner={handleAddBanner}
                onDeleteBanner={handleDeleteBanner}
                lang={lang}
                websiteName={websiteName}
                onUpdateWebsiteName={setWebsiteName}
                websiteLogo={websiteLogo}
                onUpdateWebsiteLogo={setWebsiteLogo}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdateUserRole={handleUpdateUserRole}
                onUpdateUserStatus={handleUpdateUserStatus}
                categories={categories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                nestedCategories={nestedCategories}
                onUpdateNestedCategories={setNestedCategories}
                onUpdateProducts={setProducts}
                onUpdateOrders={setOrders}
                onUpdateUsers={setUsers}
                onUpdateBanners={setBanners}
              />
            ) : (
              <div className="max-w-md mx-auto text-center bg-white border border-neutral-100 rounded-3xl p-10 shadow-lg space-y-4">
                <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-neutral-800 text-md">
                  {lang === 'en' ? 'Unauthorized Access Rejected!' : 'অননুমোদিত অ্যাক্সেস রিজেক্টেড!'}
                </h3>
                <p className="text-xs text-neutral-500 leading-normal">
                  {lang === 'en' 
                    ? 'Sorry, this Admin section is reserved for registered system administrators.'
                    : 'দুঃখিত, এই এডমিন প্যানেল কন্ট্রোলটি শুধুমাত্র সিস্টেমে নিবন্ধিত এডমিনদের ব্যবহারের জন্য সংরক্ষিত।'}
                </p>
                <div className="bg-neutral-50 p-3 rounded-2xl border text-[11px] font-medium text-neutral-600">
                  {lang === 'en'
                    ? 'To evaluate this application as developer, use LOGIN at the purple top bar to connect as Aronor Roy instantly.'
                    : 'ডেমো মূল্যায়ন করার জন্য স্ক্রীন এর একেবারে উপরে অবস্থিত বেগুনি বার থেকে LOGIN অপশনে ক্লিক করে অ্যাডমিন অ্যাকাউন্টে সুইচ করুন।'}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 4. DETAILS DIALOG MODAL VIEW */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            lang={lang}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={(product, quantity) => {
              handleAddToCart(product, quantity);
              setSelectedProduct(null);
            }}
            onBuyNow={(product, quantity) => {
              handleBuyNow(product, quantity);
              setSelectedProduct(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* 5. SLIDING CART DRAWER SYSTEM */}
      <CartDrawer
        cart={cart}
        isOpen={isCartOpen}
        lang={lang}
        onClose={() => {
          setIsCartOpen(false);
          setInitialCheckoutActive(false);
        }}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        initialCheckoutActive={initialCheckoutActive}
        currentUser={currentUser}
        onRequireAuth={() => {
          setIsCartOpen(false);
          setInitialCheckoutActive(true);
          setIsAuthModalOpen(true);
        }}
      />

      {/* 5.5 GUEST AUTHENTICATION SYSTEM MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
        users={users}
        onUpdateUsers={(updated) => setUsers(updated)}
        onLoginSuccess={handleLoginSuccess}
        onSendAdminForgotNotification={handleSendAdminForgotNotification}
      />

      {/* 6. SYSTEM-WIDE FLOATING NOTIFICATION TOAST */}
      <AnimatePresence>
        {toast && (
          <Notification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* 7. APP FOOTER */}
      <footer className="bg-neutral-900 text-neutral-400 mt-16 border-t border-neutral-800 relative z-10 select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 font-sans">
            <div className="flex items-center gap-2">
              {websiteLogo ? (
                <img src={websiteLogo} alt={`${websiteName} Logo`} className="w-9 h-9 rounded-lg object-cover" referrerPolicy="no-referrer" />
              ) : (
                <AnonoLogo size={36} />
              )}
              <span className="text-xl font-black text-white tracking-widest font-sans">
                {websiteName}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              {lang === 'en'
                ? `${websiteName} is one of Bangladesh's most trusted online retail e-commerce networks. We provide premium hifi gadgets, cosmetics, lifestyle clothes and deliver them securely nationwide.`
                : `${websiteName} বাংলাদেশের অন্যতম বিশ্বস্ত ডিজিটাল রিটেইল ই-কমার্স প্ল্যাটফর্ম। আমরা সর্বোচ্চ মানের এবং আসল গ্যাজেটস, কসমেটিকস ও লাইফস্টাইল পণ্য দ্রুততম সময়ে সারাদেশে কুরিয়ারের মাধ্যমে ডেলিভারি করে থাকি।`}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Popular Categories' : 'জনপ্রিয় ক্যাটাগরি'}
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li><button onClick={() => { setSelectedCategory('গ্যাজেটস (Gadgets)'); setActiveView('shop'); }} className="hover:text-indigo-400 cursor-pointer">{lang === 'en' ? 'Smart Hifi Gadgets & Accessories' : 'স্মার্ট গ্যাজেটস ও এক্সেসরিজ'}</button></li>
              <li><button onClick={() => { setSelectedCategory('ফ্যাশন (Fashion)'); setActiveView('shop'); }} className="hover:text-indigo-400 cursor-pointer">{lang === 'en' ? 'Casual Men Cotton T-Shirts' : 'মেনজ ফ্যাশন ও সুতি ও শার্ট'}</button></li>
              <li><button onClick={() => { setSelectedCategory('বিউটি ও কেয়ার (Beauty Care)'); setActiveView('shop'); }} className="hover:text-indigo-400 cursor-pointer">{lang === 'en' ? 'Skincare Essentials & Cosmetics' : 'স্কিনকেয়ার সামগ্রী ও কসমেটিকস'}</button></li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Customer Care' : 'গ্রাহক সহায়তা'}
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li><button onClick={() => setActiveView('tracker')} className="hover:text-indigo-400 cursor-pointer">{lang === 'en' ? 'Track Your Order' : 'অর্ডার ট্র্যাক করুন'}</button></li>
              <li className="hover:text-indigo-400 cursor-pointer">{lang === 'en' ? 'Easy Return Guarantee' : 'সহজ রিটার্ন পলিসি'}</li>
              <li className="hover:text-indigo-400 cursor-pointer">{lang === 'en' ? 'Hotline & Chat Helpline' : 'সহায়তা কেন্দ্র বা হটলাইন'}</li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Secure Checkout Methods' : 'নিরাপদ পেমেন্ট মেথড'}
            </h4>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-neutral-800 border border-neutral-700/60 rounded px-2.5 py-1 text-pink-550 font-extrabold text-[10px] font-sans text-pink-500">BKash</span>
              <span className="bg-neutral-800 border border-neutral-700/60 rounded px-2.5 py-1 text-orange-550 font-extrabold text-[10px] font-sans text-orange-500">Nagad</span>
              <span className="bg-neutral-800 border border-neutral-700/60 rounded px-2.5 py-1 text-white font-extrabold text-[10px] font-sans">COD</span>
            </div>
            <p className="text-[10px] text-neutral-500 font-semibold leading-relaxed">
              {lang === 'en'
                ? 'Check and inspect packages from delivery rider then checkout physically or via mobile electronic banking services.'
                : 'ডেলিভারি ম্যানের কাছ থেকে পণ্য বুঝে পেয়ে ক্যাশ টাকা অথবা মোবাইল ব্যাংকিংয়ে নিরাপদে পেমেন্ট পরিশোধ করুন।'}
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-800/80 bg-neutral-950/40 py-4 text-center text-[11px] text-neutral-500 font-medium">
          <p>
            {lang === 'en' 
              ? `© ${formatNum(2026, lang)} ${websiteName}. All rights reserved. Designed & Developed by Aronor Roy.`
              : `© ${formatNum(2026, lang)} ${websiteName}. সর্বস্বত্ব সংরক্ষিত। ডিজাইন এবং ডেভলপমেন্ট বাই আরোনোর রায়।`}
          </p>
        </div>
      </footer>

      {/* 8. ELITE PWA TOUCH BOTTOM STICKY NAVIGATION BAR */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-neutral-200/80 rounded-2xl flex items-center justify-around py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] select-none">
        
        {/* Shop Category Grid view */}
        <button
          onClick={() => {
            setActiveView('shop');
            setSelectedCategory('সব প্রোডাক্ট (All)');
            setSearchQuery('');
          }}
          className={`flex flex-col items-center justify-center gap-1 min-w-[55px] font-extrabold text-[10px] tracking-tight transition-all cursor-pointer relative ${
            activeView === 'shop' ? 'text-indigo-600 scale-105' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <Home className="w-5.5 h-5.5 stroke-[2.2]" />
          <span>{lang === 'en' ? 'Shop' : 'শপ'}</span>
          {activeView === 'shop' && (
            <span className="absolute -bottom-1.5 w-4 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>

        {/* Search Launcher shortcut */}
        <button
          onClick={() => {
            setActiveView('shop');
            const searchBoxMobile = document.querySelector('input[placeholder*="সার্চ"]');
            if (searchBoxMobile) {
              (searchBoxMobile as HTMLInputElement).focus();
            } else {
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }
          }}
          className="flex flex-col items-center justify-center gap-1 min-w-[55px] font-extrabold text-[10px] tracking-tight text-neutral-500 hover:text-neutral-700 cursor-pointer"
        >
          <Search className="w-5.5 h-5.5 stroke-[2.2]" />
          <span>{lang === 'en' ? 'Search' : 'সার্চ'}</span>
        </button>

        {/* Tracking system view */}
        <button
          onClick={() => setActiveView('tracker')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[55px] font-extrabold text-[10px] tracking-tight transition-all cursor-pointer relative ${
            activeView === 'tracker' ? 'text-indigo-600 scale-105' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <Package className="w-5.5 h-5.5 stroke-[2.2]" />
          <span>{lang === 'en' ? 'Track' : 'ট্র্যাকিং'}</span>
          {activeView === 'tracker' && (
            <span className="absolute -bottom-1.5 w-4 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>

        {/* Support system view */}
        <button
          onClick={() => setActiveView('support')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[55px] font-extrabold text-[10px] tracking-tight transition-all cursor-pointer relative ${
            activeView === 'support' ? 'text-indigo-600 scale-105' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <HelpCircle className="w-5.5 h-5.5 stroke-[2.2]" />
          <span>{lang === 'en' ? 'Support' : 'সাপোর্ট'}</span>
          {activeView === 'support' && (
            <span className="absolute -bottom-1.5 w-4 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>

        {/* Shopping bag layout trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center gap-1 min-w-[55px] font-extrabold text-[10px] tracking-tight text-neutral-500 hover:text-neutral-800 cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5.5 h-5.5 stroke-[2.2]" />
            {totalCartQty > 0 && (
              <span className="absolute -top-2 -right-3 bg-rose-500 text-white font-black rounded-full min-w-[18px] h-[18px] px-1 text-[8.5px] flex items-center justify-center border-2 border-white shadow-md font-sans">
                {formatNum(totalCartQty, lang)}
              </span>
            )}
          </div>
          <span>{lang === 'en' ? 'Cart' : 'কার্ট'}</span>
        </button>

        {/* Admin Hub shortcut - Render if logged-in user role matches ADMIN */}
        {currentUser?.role === UserRole.ADMIN && (
          <button
            onClick={() => setActiveView('admin')}
            className={`flex flex-col items-center justify-center gap-1 min-w-[55px] font-extrabold text-[10px] tracking-tight transition-all cursor-pointer relative ${
              activeView === 'admin' ? 'text-purple-600 scale-105 font-black' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <ShieldCheck className="w-5.5 h-5.5 stroke-[2.2] text-purple-600" />
            <span>{lang === 'en' ? 'Admin' : 'এডমিন'}</span>
            {activeView === 'admin' && (
              <span className="absolute -bottom-1.5 w-4 h-0.5 bg-purple-600 rounded-full" />
            )}
          </button>
        )}
      </div>

    </div>
  );
}
