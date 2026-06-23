import { useState, useEffect, FormEvent } from 'react';
import { Product, Order, User, UserRole, UserStatus, OrderStatus, BannerSlide, SupportTicket, TicketStatus } from '../types';
import { ParentCategory, Subcategory, SubSubcategory } from '../data/categoriesData';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Check,
  UserCheck,
  Ban,
  Upload,
  RefreshCw,
  Search,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Image,
  Settings,
  Tags,
  FolderOpen,
  MapPin,
  Clock,
  CreditCard,
  Calendar,
  User as UserIcon,
  Phone,
  Database,
  HelpCircle,
  MessageSquare,
  Key,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Browser-based client-side image compression to fit within local storage quotas
function compressImage(file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = () => {
      resolve('');
    };
  });
}

function formatOrderDate(dateStr: string | undefined, lang: 'en' | 'bn' = 'bn'): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    
    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const bnMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    
    const day = d.getDate();
    const monthIdx = d.getMonth();
    const year = d.getFullYear();
    
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? (lang === 'en' ? 'PM' : 'পিএম') : (lang === 'en' ? 'AM' : 'এএম');
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    if (lang === 'bn') {
      const bnNums: Record<string, string> = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
      };
      const toBnNum = (num: number | string) => {
        return String(num).split('').map(char => bnNums[char] || char).join('');
      };
      return `${toBnNum(day)} ${bnMonths[monthIdx]} ${toBnNum(year)} (${toBnNum(hours)}:${toBnNum(minutesStr)} ${ampm})`;
    } else {
      return `${day} ${enMonths[monthIdx]} ${year} (${hours}:${minutesStr} ${ampm})`;
    }
  } catch (e) {
    return dateStr;
  }
}

function getPaymentMethodBadge(method: string, lang: 'en' | 'bn') {
  const normalized = (method || '').toLowerCase();
  
  if (normalized.includes('bkash') || normalized.includes('বিকাশ')) {
    return (
      <span className="inline-flex items-center gap-1 bg-pink-50 border border-pink-100 text-[#e2136e] font-bold px-2.5 py-1 rounded-lg text-[9.5px]">
         <span className="w-1.5 h-1.5 rounded-full bg-[#e2136e]" /> bKash (বিকাশ)
      </span>
    );
  }
  if (normalized.includes('nagad') || normalized.includes('নগদ')) {
    return (
      <span className="inline-flex items-center gap-1 bg-orange-50 border border-orange-100 text-[#f7921e] font-bold px-2.5 py-1 rounded-lg text-[9.5px]">
         <span className="w-1.5 h-1.5 rounded-full bg-[#ec1c24]" /> Nagad (নগদ)
      </span>
    );
  }
  
  const isCod = normalized.includes('cash') || normalized.includes('cod') || normalized.includes('ডেলিভারি');
  return (
    <span className={`inline-flex items-center gap-1 ${isCod ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-neutral-50 border border-neutral-200 text-neutral-600'} font-bold px-2.5 py-1 rounded-lg text-[9.5px]`}>
       <span className={`w-1.5 h-1.5 rounded-full ${isCod ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
       {lang === 'en' ? method : (isCod ? 'ক্যাশ অন ডেলিভারি (COD)' : method)}
    </span>
  );
}

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  users: User[];
  banners: BannerSlide[];
  onAddBanner: (banner: Omit<BannerSlide, 'id'>) => void;
  onDeleteBanner: (bannerId: string) => void;
  lang?: 'en' | 'bn';
  websiteName: string;
  onUpdateWebsiteName: (name: string) => void;
  websiteLogo: string;
  onUpdateWebsiteLogo: (logo: string) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateUserRole: (userId: string, role: UserRole) => void;
  onUpdateUserStatus: (userId: string, status: UserStatus) => void;
  categories: string[];
  onAddCategory: (categoryName: string) => void;
  onDeleteCategory: (categoryName: string) => void;
  nestedCategories?: ParentCategory[];
  onUpdateNestedCategories?: (categories: ParentCategory[]) => void;
  onUpdateProducts?: (products: Product[]) => void;
  onUpdateOrders?: (orders: Order[]) => void;
  onUpdateUsers?: (users: User[]) => void;
  onUpdateBanners?: (banners: BannerSlide[]) => void;
}

export default function AdminPanel({
  products,
  orders,
  users,
  banners = [],
  onAddBanner,
  onDeleteBanner,
  lang = 'bn',
  websiteName,
  onUpdateWebsiteName,
  websiteLogo,
  onUpdateWebsiteLogo,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateUserRole,
  onUpdateUserStatus,
  categories,
  onAddCategory,
  onDeleteCategory,
  nestedCategories = [],
  onUpdateNestedCategories,
  onUpdateProducts,
  onUpdateOrders,
  onUpdateUsers,
  onUpdateBanners
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users' | 'banners' | 'settings' | 'categories' | 'database' | 'tickets' | 'signup_db'>('dashboard');
  const [signupSearch, setSignupSearch] = useState('');
  const [forgotAlerts, setForgotAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'signup_db') {
      const saved = localStorage.getItem('anono_forgot_notifications');
      if (saved) {
        try {
          setForgotAlerts(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading forgot password notifications:', e);
        }
      }
    }
  }, [activeTab]);


  // Banner Management state
  const [bIsFullImage, setBIsFullImage] = useState(true);
  const [bBadgeBn, setBBadgeBn] = useState('');
  const [bBadgeEn, setBBadgeEn] = useState('');
  const [bTitleBn, setBTitleBn] = useState('');
  const [bTitleEn, setBTitleEn] = useState('');
  const [bSubtitleBn, setBSubtitleBn] = useState('');
  const [bSubtitleEn, setBSubtitleEn] = useState('');
  const [bContentBn, setBContentBn] = useState('');
  const [bContentEn, setBContentEn] = useState('');
  const [bDiscountBn, setBDiscountBn] = useState('');
  const [bDiscountEn, setBDiscountEn] = useState('');
  const [bDiscountBg, setBDiscountBg] = useState('bg-purple-600 text-white');
  const [bBgPreset, setBBgPreset] = useState('bg-gradient-to-r from-[#d2f6f4] via-white to-[#ffe5d4]');
  const [bCategory, setBCategory] = useState('সব প্রোডাক্ট (All)');
  const [bSearchQuery, setBSearchQuery] = useState('');
  const [bImageUrl, setBImageUrl] = useState('');
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [bImageSource, setBImageSource] = useState<'url' | 'file'>('url');
  const [bUploadedFileName, setBUploadedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null);

  const handleBannerFileChange = (file: File) => {
    if (file) {
      setBUploadedFileName(file.name);
      compressImage(file).then((compressedBase64) => {
        setBImageUrl(compressedBase64);
      }).catch(err => {
        console.error('Image compression failed:', err);
        // Fallback to uncompressed read if canvas fails
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setBImageUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleBannerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!bImageUrl) {
      showAlert(
        lang === 'en' ? 'Missing Image' : 'ছবির লিংক অনুপস্থিত',
        lang === 'en' ? 'Banner Image or URL is required!' : 'ব্যানারের ইমেজ অথবা অনলাইন লিংকটি অবশ্যই দিন!',
        'error'
      );
      return;
    }

    onAddBanner({
      badge: { bn: bBadgeBn || 'মেগা ক্যাম্পেইন', en: bBadgeEn || 'MEGA CAMPAIGN' },
      title: { bn: bTitleBn || 'অন্যান্য ডিলস', en: bTitleEn || 'Special Deals' },
      subtitle: { bn: bSubtitleBn || 'সেরা ডিল ও অফার', en: bSubtitleEn || 'Top Quality Deals' },
      content: { bn: bContentBn || 'আজই কিনুন!', en: bContentEn || 'Get yours today!' },
      discountText: { bn: bDiscountBn || '১০% ডিসকাউন্ট', en: bDiscountEn || '10% DISCOUNT' },
      discountBg: bDiscountBg,
      textColor: 'text-neutral-900',
      badgeType: 'anono',
      bgPresetClass: bBgPreset,
      category: bCategory,
      searchQuery: bSearchQuery,
      imageUrl: bImageUrl,
      isFullImage: bIsFullImage
    });

    // Reset Form
    setBBadgeBn('');
    setBBadgeEn('');
    setBTitleBn('');
    setBTitleEn('');
    setBSubtitleBn('');
    setBSubtitleEn('');
    setBContentBn('');
    setBContentEn('');
    setBDiscountBn('');
    setBDiscountEn('');
    setBDiscountBg('bg-purple-600 text-white');
    setBBgPreset('bg-gradient-to-r from-[#d2f6f4] via-white to-[#ffe5d4]');
    setBCategory('সব প্রোডাক্ট (All)');
    setBSearchQuery('');
    setBImageUrl('');
    setBImageSource('url');
    setBUploadedFileName('');
    setIsBannerFormOpen(false);
  };

  // Product CRUD states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState<number | ''>('');
  const [pOriginalPrice, setPOriginalPrice] = useState<number | ''>('');
  const [pCategory, setPCategory] = useState(categories[1] || 'গ্যাজেটস (Gadgets)'); // Default to first actual category
  const [pSubcategory, setPSubcategory] = useState('');
  const [pSubSubcategory, setPSubSubcategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Nestable Category state hooks & helper functions
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [subBnInput, setSubBnInput] = useState('');
  const [subEnInput, setSubEnInput] = useState('');
  const [subSubBnInputs, setSubSubBnInputs] = useState<{ [subEn: string]: string }>({});
  const [subSubEnInputs, setSubSubEnInputs] = useState<{ [subEn: string]: string }>({});

  // Local states for new Raw Database Management option
  const [dbSelectedTable, setDbSelectedTable] = useState<'products' | 'orders' | 'users' | 'banners'>('products');
  const [dbEditedJsonText, setDbEditedJsonText] = useState<string>('');
  const [dbLastSyncedTable, setDbLastSyncedTable] = useState<string>('');

  // Auto-sync JSON textarea when active table selection changes
  if (dbLastSyncedTable !== dbSelectedTable) {
    let rawText = '';
    if (dbSelectedTable === 'products') rawText = JSON.stringify(products, null, 2);
    else if (dbSelectedTable === 'orders') rawText = JSON.stringify(orders, null, 2);
    else if (dbSelectedTable === 'users') rawText = JSON.stringify(users, null, 2);
    else if (dbSelectedTable === 'banners') rawText = JSON.stringify(banners, null, 2);
    setDbEditedJsonText(rawText);
    setDbLastSyncedTable(dbSelectedTable);
  }

  // Initialize selectedParentId automatically once nested categories are loaded
  if (!selectedParentId && nestedCategories && nestedCategories.length > 0) {
    setSelectedParentId(nestedCategories[0].id);
  }

  const handleAddSubcategory = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedParentId) return;
    if (!subEnInput.trim() || !subBnInput.trim()) {
      showAlert(
        lang === 'en' ? 'Incomplete Fields' : 'অসম্পূর্ণ ঘর',
        lang === 'en' ? 'Please fill in both English and Bengali names!' : 'দয়া করে বাংলা ও ইংরেজি—উভয় নামই পূরণ করুন!',
        'error'
      );
      return;
    }

    const updated = nestedCategories.map(pc => {
      if (pc.id === selectedParentId) {
        const subcategories = pc.subcategories ? [...pc.subcategories] : [];
        if (subcategories.some(s => s.nameEn.toLowerCase() === subEnInput.trim().toLowerCase())) {
          showAlert(lang === 'en' ? 'Duplicate' : 'অনুরূপ বিদ্যমান', lang === 'en' ? 'Subcategory already exists!' : 'এই সাবক্যাটাগরি ইতিমধ্যেই বিদ্যমান আছে।', 'error');
          return pc;
        }
        return {
          ...pc,
          subcategories: [...subcategories, { nameBn: subBnInput.trim(), nameEn: subEnInput.trim(), subSubcategories: [] }]
        };
      }
      return pc;
    });

    if (onUpdateNestedCategories) {
      onUpdateNestedCategories(updated);
      showAlert(lang === 'en' ? 'Success' : 'সফল হয়েছে', lang === 'en' ? 'Subcategory added!' : 'সাবক্যাটাগরি যুক্ত করা হয়েছে!', 'success');
      setSubBnInput('');
      setSubEnInput('');
    }
  };

  const handleDeleteSubcategory = (subEn: string) => {
    if (!selectedParentId) return;
    const updated = nestedCategories.map(pc => {
      if (pc.id === selectedParentId) {
        return {
          ...pc,
          subcategories: (pc.subcategories || []).filter(s => s.nameEn !== subEn)
        };
      }
      return pc;
    });
    if (onUpdateNestedCategories) {
      onUpdateNestedCategories(updated);
      showAlert(lang === 'en' ? 'Deleted' : 'মুছে ফেলা হয়েছে', lang === 'en' ? 'Subcategory removed!' : 'সাবক্যাটাগরি মুছে ফেলা হয়েছে!', 'info');
    }
  };

  const handleAddSubSubcategory = (subEn: string) => {
    if (!selectedParentId) return;
    const bnVal = (subSubBnInputs[subEn] || '').trim();
    const enVal = (subSubEnInputs[subEn] || '').trim();

    if (!bnVal || !enVal) {
      showAlert(
        lang === 'en' ? 'Fields Empty' : 'নাম খালি',
        lang === 'en' ? 'Please provide both English and Bengali names for the sub-subcategory!' : 'দয়া করে উপ-উপক্যাটাগরির বাংলা ও ইংরেজি—উভয় নামই পূরণ করুন!',
        'error'
      );
      return;
    }

    const updated = nestedCategories.map(pc => {
      if (pc.id === selectedParentId) {
        const subcategories = (pc.subcategories || []).map(sub => {
          if (sub.nameEn === subEn) {
            const subSubcategories = sub.subSubcategories ? [...sub.subSubcategories] : [];
            if (subSubcategories.some(ss => ss.nameEn.toLowerCase() === enVal.toLowerCase())) {
              showAlert(lang === 'en' ? 'Duplicate' : 'অনুরূপ বিদ্যমান', lang === 'en' ? 'Sub-subcategory already exists!' : 'এই উপক্যাটাগরি ইতিমধ্যেই বিদ্যমান আছে।', 'error');
              return sub;
            }
            return {
              ...sub,
              subSubcategories: [...subSubcategories, { nameBn: bnVal, nameEn: enVal }]
            };
          }
          return sub;
        });
        return { ...pc, subcategories };
      }
      return pc;
    });

    if (onUpdateNestedCategories) {
      onUpdateNestedCategories(updated);
      showAlert(lang === 'en' ? 'Success' : 'সফল হয়েছে', lang === 'en' ? 'Sub-Subcategory added!' : 'সাব-উপক্যাটাগরি যুক্ত করা হয়েছে!', 'success');
      setSubSubBnInputs(prev => ({ ...prev, [subEn]: '' }));
      setSubSubEnInputs(prev => ({ ...prev, [subEn]: '' }));
    }
  };

  const handleDeleteSubSubcategory = (subEn: string, subSubEn: string) => {
    if (!selectedParentId) return;
    const updated = nestedCategories.map(pc => {
      if (pc.id === selectedParentId) {
        const subcategories = (pc.subcategories || []).map(sub => {
          if (sub.nameEn === subEn) {
            return {
              ...sub,
              subSubcategories: (sub.subSubcategories || []).filter(ss => ss.nameEn !== subSubEn)
            };
          }
          return sub;
        });
        return { ...pc, subcategories };
      }
      return pc;
    });
    if (onUpdateNestedCategories) {
      onUpdateNestedCategories(updated);
      showAlert(lang === 'en' ? 'Deleted' : 'মুছে ফেলা হয়েছে', lang === 'en' ? 'Sub-subcategory removed!' : 'সাব-উপক্যাটাগরি মুছে ফেলা হয়েছে!', 'info');
    }
  };
  const [pImage, setPImage] = useState('');
  const [pImagesText, setPImagesText] = useState('');
  const [pSlotImages, setPSlotImages] = useState<string[]>(['', '', '', '', '', '']);
  const [pActiveSlot, setPActiveSlot] = useState<number>(0);
  const [pDescription, setPDescription] = useState('');
  const [pStock, setPStock] = useState(10);
  const [pIsFeatured, setPIsFeatured] = useState(false);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'All'>('All');
  const [directDeleteId, setDirectDeleteId] = useState('');

  // Custom dialogs to bypass blocked standard iframe window.confirm & window.alert
  const [customConfirm, setCustomConfirm] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
  } | null>(null);

  const [customAlert, setCustomAlert] = useState<{
    title: string;
    description: string;
    type?: 'success' | 'info' | 'error';
  } | null>(null);

  // Customer Support Tickets top-level state
  const [adminTickets, setAdminTickets] = useState<SupportTicket[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('anono_tickets') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [replyText, setReplyText] = useState<{ [ticketId: string]: string }>({});

  // Sync tickets on tab switch
  useEffect(() => {
    if (activeTab === 'tickets') {
      const saved = localStorage.getItem('anono_tickets');
      if (saved) {
        try {
          setAdminTickets(JSON.parse(saved));
        } catch (e) {
          // ignore
        }
      }
    }
  }, [activeTab]);

  const saveAdminTickets = (updated: SupportTicket[]) => {
    setAdminTickets(updated);
    localStorage.setItem('anono_tickets', JSON.stringify(updated));
  };

  // Handle Submit Reply and Update Status
  const handleUpdateTicket = (ticketId: string, status: TicketStatus, responseMsg?: string) => {
    const updated = adminTickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status,
          response: responseMsg !== undefined ? responseMsg : t.response
        };
      }
      return t;
    });
    saveAdminTickets(updated);
  };

  const showConfirm = (
    title: string,
    description: string,
    onConfirm: () => void,
    isDanger = true,
    confirmText?: string,
    cancelText?: string
  ) => {
    setCustomConfirm({
      title,
      description,
      onConfirm: () => {
        onConfirm();
        setCustomConfirm(null);
      },
      isDanger,
      confirmText: confirmText || (lang === 'en' ? 'Yes, Confirmed' : 'হ্যাঁ, নিশ্চিত করুন'),
      cancelText: cancelText || (lang === 'en' ? 'Cancel' : 'বাতিল')
    });
  };

  const showAlert = (
    title: string,
    description: string,
    type: 'success' | 'info' | 'error' = 'success'
  ) => {
    setCustomAlert({
      title,
      description,
      type
    });
  };

  const handleDirectDeleteById = (e: FormEvent) => {
    e.preventDefault();
    if (!directDeleteId.trim()) {
      showAlert(
        lang === 'en' ? 'Required Field' : 'প্রয়োজনীয় ফিল্ড',
        lang === 'en' ? 'Please enter a product ID or number!' : 'দয়া করে একটি নির্দিষ্ট প্রোডাক্ট আইডি বা নাম্বার টাইপ করুন!',
        'error'
      );
      return;
    }
    const targetId = directDeleteId.trim();
    // Match either absolute ID, case-insensitive ID, or direct raw numbers
    const foundProduct = products.find(p => 
      p.id === targetId || 
      p.id.toLowerCase() === targetId.toLowerCase() || 
      p.id === `tech_p_${targetId}` || 
      p.id === `gen_p_${targetId}`
    );
    if (foundProduct) {
      showConfirm(
        lang === 'en' ? 'Confirm Deletion' : 'পণ্য ডিলিট নিশ্চিত করুন',
        lang === 'en' ? `Are you sure you want to delete "${foundProduct.name}" (ID: ${foundProduct.id})?` : `আপনি কি নিশ্চিতভাবে "${foundProduct.name}" (আইডি: ${foundProduct.id}) পণ্যটি ডিলিট করতে চান?`,
        () => {
          onDeleteProduct(foundProduct.id);
          setDirectDeleteId('');
          showAlert(
            lang === 'en' ? 'Deleted Successfully' : 'ডিলিট সম্পন্ন',
            lang === 'en' ? 'Product deleted successfully from catalog!' : 'পণ্যটি সফলভাবে ক্যাটালগ থেকে মুছে ফেলা হয়েছে!',
            'success'
          );
        },
        true
      );
    } else {
      showAlert(
        lang === 'en' ? 'Product Not Found' : 'পণ্য পাওয়া যায়নি',
        lang === 'en' ? `Product with ID or number "${targetId}" not found!` : `"${targetId}" আইডির কোনো পণ্য পাওয়া যায়নি! অনুগ্রহ করে সঠিক সম্পূর্ণ আইডি টাইপ করুন।`,
        'error'
      );
    }
  };

  // Stats calculation
  const totalSales = (orders || [])
    .filter(o => o && o.status !== OrderStatus.CANCELLED)
    .reduce((sum, o) => sum + (Number(o?.totalAmount) || 0), 0);

  const pendingOrdersCount = (orders || []).filter(o => o && o.status === OrderStatus.PENDING).length;
  const criticalStockCount = products.filter(p => p.stock <= 5).length;
  const activeUsersCount = users.filter(u => u.status === UserStatus.ACTIVE).length;

  // Open Product Modal for Create
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setPName('');
    setPPrice('');
    setPOriginalPrice('');
    setPCategory(categories[1] || 'গ্যাজেটস (Gadgets)');
    const defaultImg = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80';
    setPImage(defaultImg); // nice default
    setPImagesText('');
    setPSlotImages([defaultImg, '', '', '', '', '']);
    setPActiveSlot(0);
    setPDescription('');
    setPStock(10);
    setPIsFeatured(false);
    setPSubcategory('');
    setPSubSubcategory('');
    setIsProductModalOpen(true);
  };

  // Open Product Modal for Edit
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPPrice(p.price);
    setPOriginalPrice(p.originalPrice || '');
    setPCategory(p.category);
    setPImage(p.image);
    setPImagesText(p.images ? p.images.join(', ') : '');
    const initialSlots = ['', '', '', '', '', ''];
    initialSlots[0] = p.image || '';
    if (p.images) {
      for (let i = 0; i < 5; i++) {
        initialSlots[i + 1] = p.images[i] || '';
      }
    }
    setPSlotImages(initialSlots);
    setPActiveSlot(0);
    setPDescription(p.description);
    setPStock(p.stock);
    setPIsFeatured(!!p.isFeatured);
    setPSubcategory(p.subcategory || '');
    setPSubSubcategory(p.subSubcategory || '');
    setIsProductModalOpen(true);
  };

  // Handle direct local image uploads
  const handleSlotImageChange = (index: number, value: string) => {
    const updated = [...pSlotImages];
    updated[index] = value;
    setPSlotImages(updated);
    
    // Sync with existing states for backward-compatibility
    if (index === 0) {
      setPImage(value);
    } else {
      const activeExtras = updated.slice(1).filter(Boolean);
      setPImagesText(activeExtras.join(', '));
    }
  };

  const handleSlotImageFileUpload = (index: number, file: File) => {
    compressImage(file).then((compressedBase64) => {
      handleSlotImageChange(index, compressedBase64);
    }).catch(err => {
      console.error('Image compression failed:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleSlotImageChange(index, reader.result);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageUpload = (file: File) => {
    handleSlotImageFileUpload(0, file);
  };

  const handleGalleryImagesUpload = (files: FileList) => {
    const promises = Array.from(files).map((file) => compressImage(file));

    Promise.all(promises).then((results) => {
      const updated = [...pSlotImages];
      results.forEach((imageUrl) => {
        // Find next empty slot in Slot 2-6 (indexes 1-5)
        const emptyIdx = updated.findIndex((slot, sIdx) => sIdx > 0 && !slot);
        if (emptyIdx !== -1) {
          updated[emptyIdx] = imageUrl;
        }
      });
      setPSlotImages(updated);
      const activeExtras = updated.slice(1).filter(Boolean);
      setPImagesText(activeExtras.join(', '));
    }).catch(err => {
      console.error('Gallery compression failed:', err);
      const b64Promises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(b64Promises).then((results) => {
        const updated = [...pSlotImages];
        results.forEach((imageUrl) => {
          const emptyIdx = updated.findIndex((slot, sIdx) => sIdx > 0 && !slot);
          if (emptyIdx !== -1) {
            updated[emptyIdx] = imageUrl;
          }
        });
        setPSlotImages(updated);
        const activeExtras = updated.slice(1).filter(Boolean);
        setPImagesText(activeExtras.join(', '));
      });
    });
  };

  // Submit Product Add/Edit Form
  const handleSubmitProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) {
      showAlert(
        lang === 'en' ? 'Supply Name' : 'পণ্যের নাম প্রয়োজন',
        lang === 'en' ? 'Please supply a valid product name.' : 'দয়া করে পণ্যের নাম দিন।',
        'error'
      );
      return;
    }
    
    const priceVal = pPrice === '' ? 0 : pPrice;
    const origPriceVal = pOriginalPrice === '' ? priceVal : pOriginalPrice;

    if (priceVal <= 0) {
      showAlert(
        lang === 'en' ? 'Invalid Price' : 'ভুল বিক্রয় মূল্য',
        lang === 'en' ? 'Please set a valid positive retail price.' : 'দয়া করে একটি সঠিক বিক্রয় মূল্য নির্ধারণ করুন।',
        'error'
      );
      return;
    }

    const primaryImage = pSlotImages[0] || pImage;
    const imagesArray = pSlotImages.slice(1).filter(Boolean);

    if (editingProduct) {
      onEditProduct({
        ...editingProduct,
        name: pName,
        price: priceVal,
        originalPrice: origPriceVal,
        category: pCategory,
        image: primaryImage,
        images: imagesArray.length > 0 ? imagesArray : undefined,
        description: pDescription,
        stock: pStock,
        isFeatured: pIsFeatured,
        subcategory: pSubcategory || undefined,
        subSubcategory: pSubSubcategory || undefined
      });
    } else {
      onAddProduct({
        name: pName,
        price: priceVal,
        originalPrice: origPriceVal,
        category: pCategory,
        image: primaryImage,
        images: imagesArray.length > 0 ? imagesArray : undefined,
        description: pDescription,
        stock: pStock,
        isFeatured: pIsFeatured,
        subcategory: pSubcategory || undefined,
        subSubcategory: pSubSubcategory || undefined
      });
    }
    setIsProductModalOpen(false);
  };

  // Search filter lists
  const filteredProducts = products.filter(p => {
    const pName = p?.name || '';
    const pCategory = p?.category || '';
    const pId = p?.id || '';
    const q = (productSearch || '').toLowerCase();
    return pName.toLowerCase().includes(q) ||
           pCategory.toLowerCase().includes(q) ||
           pId.toLowerCase().includes(q);
  });

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'All') return true;
    return o.status === orderFilter;
  });

  // Dynamic matched elements for nesting
  const matchedParents = (nestedCategories || []).filter(p => p.mappedCategory === pCategory);
  const matchedSubcategories: Subcategory[] = [];
  matchedParents.forEach(p => {
    if (p.subcategories) matchedSubcategories.push(...p.subcategories);
  });
  const currentSubObj = matchedSubcategories.find(s => s.nameEn === pSubcategory || s.nameBn === pSubcategory);
  const matchedSubSubcategories: SubSubcategory[] = currentSubObj?.subSubcategories || [];

  // Dynamic collections of all available category/subcategory/sub-subcategory tags for autocompletion datalists
  const adminCategorySuggestions = Array.from(new Set([
    ...categories.slice(1),
    ...products.map(p => p.category).filter(Boolean)
  ]));

  const adminSubcategorySuggestions = Array.from(new Set([
    ...matchedSubcategories.map(s => s.nameEn),
    ...matchedSubcategories.map(s => s.nameBn).filter(Boolean),
    ...(nestedCategories || []).flatMap(p => (p.subcategories || []).flatMap(s => [s.nameEn, s.nameBn])).filter(Boolean),
    ...products.map(p => p.subcategory).filter(Boolean)
  ]));

  const adminSubSubcategorySuggestions = Array.from(new Set([
    ...matchedSubSubcategories.map(ss => ss.nameEn),
    ...matchedSubSubcategories.map(ss => ss.nameBn).filter(Boolean),
    ...(nestedCategories || []).flatMap(p => (p.subcategories || []).flatMap(s => (s.subSubcategories || []).flatMap(ss => [ss.nameEn, ss.nameBn]))).filter(Boolean),
    ...products.map(p => p.subSubcategory).filter(Boolean)
  ]));

  return (
    <div className="bg-neutral-50/50 rounded-3xl border border-neutral-100 shadow-sm p-4 md:p-8 min-h-[600px] grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-neutral-100 p-4 space-y-1.5 h-fit">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-3 mb-4">
          {lang === 'en' ? 'Admin Action Deck' : 'এডমিন ডিক্টেশন প্যানেল'}
        </h3>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span>{lang === 'en' ? 'Analytics Board' : 'এডমিন ড্যাশবোর্ড'}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4.5 h-4.5" />
            <span>{lang === 'en' ? `Product Catalog (${products.length})` : `পণ্য তালিকা (${products.length})`}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4.5 h-4.5" />
            <span>{lang === 'en' ? `Customer Orders (${(orders || []).length})` : `গ্রাহক অর্ডার্স (${(orders || []).length})`}</span>
          </div>
          {pendingOrdersCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === 'orders' ? 'bg-white text-indigo-600' : 'bg-amber-100 text-amber-700'
            }`}>
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4.5 h-4.5" />
            <span>{lang === 'en' ? `User Registry (${users.length})` : `ইউজার কন্ট্রোল (${users.length})`}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => setActiveTab('signup_db')}
          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'signup_db'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Database className="w-4.5 h-4.5 text-rose-500" />
            <span className="text-left font-bold">{lang === 'en' ? 'User Signup Database' : 'ইউজার sinup ডাটাবেজ'}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60 animate-bounce" />
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'banners'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Image className="w-4.5 h-4.5" />
            <span>{lang === 'en' ? `Campaign Banners (${banners.length})` : `ক্যাম্পেইন ব্যানারস (${banners.length})`}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4.5 h-4.5" />
            <span>{lang === 'en' ? `Category Manager (${categories.length - 1})` : `ক্যাটাগরি ম্যানেজার (${categories.length - 1})`}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4.5 h-4.5" />
            <span>{lang === 'en' ? 'Branding & Name' : 'ওয়েবসাইটের নাম ও লোগো'}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'database'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Database className="w-4.5 h-4.5" />
            <span>{lang === 'en' ? 'Raw Database Hub' : 'ডাটাবেজ কন্ট্রোল'}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'tickets'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5" />
            <span>{lang === 'en' ? 'Support Tickets Management' : 'গ্রাহক সাপোর্ট টিকিট ম্যানেজার'}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>

      {/* Main Panel Output */}
      <div className="lg:col-span-3 h-full flex flex-col">
        {/* 1. DASHBOARD OVERVIEW PANEL */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Page Title */}
            <div>
              <h2 className="text-xl font-extrabold text-neutral-800">ব্যবসায়িক স্ট্যাটিসটিক্স</h2>
              <p className="text-xs text-neutral-400">ANONO স্টোর ও প্ল্যাটফর্মের বর্তমান সেলস ও অপারেশন ওভারভিউ।</p>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">সর্বমোট সেলস</span>
                <p className="text-xl font-black text-emerald-600">৳{Number(totalSales || 0).toLocaleString('bn-BD')}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                  <TrendingUp className="w-3 h-3" />
                  <span>১০% গ্রোথ</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">মোট অর্ডার সংখ্যা</span>
                <p className="text-xl font-black text-neutral-800">{(orders || []).length} টি</p>
                <span className="text-[10px] text-neutral-400 font-medium font-sans">সারাদেশ থেকে</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">পেন্ডিং ডেলিভারি</span>
                <p className={`text-xl font-black ${pendingOrdersCount > 0 ? 'text-amber-500 font-black' : 'text-neutral-800'}`}>
                  {pendingOrdersCount} টি
                </p>
                <span className="text-[10px] text-neutral-400 font-medium">ডেলিভারি অপেক্ষমান</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">স্টক সংকট</span>
                <p className={`text-xl font-black ${criticalStockCount > 0 ? 'text-rose-500' : 'text-neutral-800'}`}>
                  {criticalStockCount} টি
                </p>
                <span className="text-[10px] text-rose-500 font-bold">স্টক রিফিলের প্রয়োজন</span>
              </div>
            </div>

            {/* Dashboard Visual Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left section: Critical Alerts list */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-xs space-y-4 md:col-span-2">
                <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5 text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>জরুরী স্টক সতর্কতা (Critical Stock Warning)</span>
                </h3>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                  {products.filter(p => p.stock <= 5).length === 0 ? (
                    <p className="text-center text-xs text-neutral-400 py-6">কোনো স্টকের সংকট নেই!</p>
                  ) : (
                    products
                      .filter(p => p.stock <= 5)
                      .map(p => (
                        <div key={p.id} className="flex justify-between items-center bg-rose-50/50 rounded-xl px-3 py-2.5 border border-rose-100">
                          <div className="flex items-center gap-2">
                            <img src={p.image} className="w-8 h-8 rounded object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <p className="text-xs font-bold text-neutral-800 line-clamp-1">{p.name}</p>
                              <span className="text-[10px] text-neutral-400">{p.category}</span>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-100/50 px-2.5 py-1 rounded-lg">
                            স্টক: মাত্র {p.stock} টি বাকি!
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Right section: System User Stats */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5 text-indigo-600">
                    <Users className="w-4 h-4" />
                    <span>ইউজার অ্যাকাউন্ট ডিস্ট্রিবিউশন</span>
                  </h3>
                  <div className="space-y-3 py-3">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-neutral-500">মোট গ্রাহক সংখ্যা:</span>
                      <span className="font-bold text-neutral-800">{users.length} জন</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-neutral-500">সক্রিয় অ্যাকাউন্ট (Active):</span>
                      <span className="font-bold text-emerald-600">{activeUsersCount} জন</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-neutral-500">নিষিদ্ধ / ব্লক অ্যাকাউন্ট (Blocked):</span>
                      <span className="font-bold text-rose-600">{users.filter(u => u.status === UserStatus.BLOCKED).length} জন</span>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-50/50 p-2.5 border border-indigo-100 rounded-xl text-[10px] text-indigo-900 leading-relaxed font-semibold">
                  ইউজারদের অ্যাক্সেস কন্ট্রোল বা ব্লক করতে বামপাশের "ইউজার কন্ট্রোল" অপশন ব্যবহার করুন।
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS CRUD INDEX */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-neutral-800">পণ্য ক্যাটালগ ও এডিট</h2>
                <p className="text-xs text-neutral-400">নতুন পণ্য যোগ করুন, ডিলিট করুন অথবা যেকোনো পণ্যের স্টক ও প্রাইস মডিফাই করুন।</p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>নতুন পণ্য যোগ করুন</span>
              </button>
            </div>

            {/* Quick Actions Board */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pb-1">
              {/* Search Box */}
              <div className="relative md:col-span-7">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="নাম, ক্যাটাগরি বা পণ্যের আইডি নাম্বার দিয়ে খুঁজুন..."
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-2 text-xs h-10 focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3.5" />
              </div>

              {/* Quick Action: Direct Delete Product by ID/Number */}
              <form onSubmit={handleDirectDeleteById} className="flex gap-2 md:col-span-5 w-full">
                <input
                  type="text"
                  placeholder="পণ্যের আইডি বা নাম্বার লিখে ডিলিট (উদা: tech_p_12)"
                  value={directDeleteId}
                  onChange={(e) => setDirectDeleteId(e.target.value)}
                  className="bg-white border text-neutral-800 border-neutral-200 rounded-xl px-3 py-2 text-xs flex-1 h-10 font-mono focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 h-10 cursor-pointer active:scale-95 transition-transform shadow-xs flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>আইডি ডিলিট</span>
                </button>
              </form>
            </div>

            {/* Product Table List */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-bold text-neutral-500">
                    <th className="px-4 py-3">ছবি ও নাম</th>
                    <th className="px-4 py-3">ক্যাটাগরি</th>
                    <th className="px-4 py-3 text-right">বিক্রয় মূল্য</th>
                    <th className="px-4 py-3 text-center">স্টক</th>
                    <th className="px-4 py-3 text-center">বৈশিষ্ট্য</th>
                    <th className="px-4 py-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-xs text-neutral-400 py-10">কোনো পণ্য পাওয়া যায়নি!</td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => (
                      <tr key={p.id} className="text-xs font-medium text-neutral-700 hover:bg-neutral-50/50">
                        <td className="px-4 py-3 flex items-center gap-2">
                          <img src={p.image} className="w-10 h-10 object-cover rounded-lg border flex-shrink-0" referrerPolicy="no-referrer" />
                          <div className="flex flex-col min-w-0">
                            <span className="line-clamp-2 leading-relaxed max-w-[240px] font-bold text-neutral-850">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-neutral-400 mt-0.5">
                              ID CODE: <span className="bg-neutral-100 text-neutral-600 px-1 py-0.5 rounded border select-all font-semibold font-mono">{p.id}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-neutral-550">{p.category}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-indigo-600 text-neutral-900">
                          ৳{Number(p?.price || 0).toLocaleString('bn-BD')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-lg font-bold text-[10px] ${
                            p.stock === 0
                              ? 'bg-rose-100 text-rose-700'
                              : p.stock <= 5
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.stock} টি
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {p.isFeatured ? (
                            <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-md font-bold">Featured</span>
                          ) : (
                            <span className="text-neutral-300">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                              title="পণ্যের তথ্য এডিট"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                showConfirm(
                                  lang === 'en' ? 'Confirm Deletion' : 'পণ্য ডিলিট নিশ্চিত করুন',
                                  lang === 'en' ? `Are you sure you want to delete "${p.name}" (ID: ${p.id})?` : `আপনি কি নিশ্চিতভাবে "${p.name}" (আইডি: ${p.id}) পণ্যটি ডিলিট করতে চান?`,
                                  () => {
                                    onDeleteProduct(p.id);
                                    showAlert(
                                      lang === 'en' ? 'Deleted Successfully' : 'ডিলিট সম্পন্ন',
                                      lang === 'en' ? 'Product deleted successfully.' : 'পণ্যটি সফলভাবে ক্যাটালগ থেকে সম্পূর্ণ ডিলিট করা হয়েছে।',
                                      'success'
                                    );
                                  }
                                );
                              }}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                              title="পণ্যটি ডিলিট করুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ORDERS LIST & TRACKING CONTROL */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-neutral-800">অর্ডার কন্ট্রোল সেন্টার</h2>
              <p className="text-xs text-neutral-400">সকল গ্রাহকের অর্ডার কন্ট্রোল করুন, অর্ডারের স্ট্যাটাস মডিফাই অথবা ট্র্যাক করুন।</p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {(['All', ...Object.values(OrderStatus)] as const).map(option => (
                <button
                  key={option}
                  onClick={() => setOrderFilter(option)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    orderFilter === option
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {option === 'All' ? 'সব অর্ডার' : option}
                </button>
              ))}
            </div>

            {/* Orders Table view */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-bold text-neutral-500">
                    <th className="px-4 py-3">অর্ডার আইডি ও সময়</th>
                    <th className="px-4 py-3">গ্রাহক ও ডেলিভারি ঠিকানা</th>
                    <th className="px-4 py-3">অর্ডারকৃত প্রোডাক্ট (ছবি সহ)</th>
                    <th className="px-4 py-3 text-right">সর্বমোট টাকা ও পেমেন্ট</th>
                    <th className="px-4 py-3 text-center">স্ট্যাটাস</th>
                    <th className="px-4 py-3 text-center">অবস্থা পরিবর্তন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-xs text-neutral-400 py-10">কোনো অর্ডার পাওয়া যায়নি!</td>
                    </tr>
                  ) : (
                    filteredOrders.map(o => (
                      <tr key={o?.id || Math.random().toString()} className="text-xs font-medium text-neutral-700 hover:bg-neutral-50/30 transition-colors">
                        {/* Order ID & Time */}
                        <td className="px-4 py-3 space-y-1">
                          <div className="font-mono font-black text-[12px] bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 px-2 py-0.5 rounded-md inline-block shadow-3xs cursor-default">
                            {o?.id || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-semibold" title="অর্ডারের তারিখ ও সময়">
                            <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span>{formatOrderDate(o?.createdAt, lang)}</span>
                          </div>
                        </td>

                        {/* Customer & Address Details */}
                        <td className="px-4 py-3 space-y-1.5 max-w-[220px]">
                          <div className="font-extrabold text-neutral-800 text-[11.5px] flex items-center gap-1">
                            <UserIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{o?.name || 'Customer'}</span>
                          </div>
                          
                          {o?.phone && (
                            <div className="text-neutral-500 text-[10.5px] font-bold flex items-center gap-1">
                              <Phone className="w-3 h-3 text-neutral-400 shrink-0" />
                              <span className="font-mono">{o.phone}</span>
                            </div>
                          )}

                          <div className="text-neutral-500 text-[10.5px] flex items-start gap-1 p-1.5 bg-neutral-50 rounded-lg border border-neutral-100" title={o?.address || ''}>
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                            <span className="line-clamp-2 leading-tight font-medium text-neutral-600">{o?.address || 'No Address'}</span>
                          </div>
                        </td>

                        {/* Order items with product pictures */}
                        <td className="px-4 py-3 space-y-1.5 max-w-[300px]">
                          {(o?.items || []).map((it, idx) => {
                            const pName = it?.product?.name || (lang === 'en' ? 'Product' : 'পণ্য');
                            const qty = it?.quantity || 1;
                            const pPrice = it?.product?.price || 0;
                            const imgUrl = it?.product?.image || '';
                            
                            return (
                              <div key={idx} className="flex items-center gap-2.5 bg-neutral-50/60 p-1.5 rounded-xl border border-neutral-100 max-w-[280px]">
                                <img 
                                  src={imgUrl} 
                                  alt={pName} 
                                  className="w-10 h-10 rounded-lg object-cover bg-neutral-100 border border-neutral-200 shrink-0" 
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&auto=format&fit=crop&q=80';
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-neutral-800 text-[10.5px] truncate block" title={pName}>{pName}</p>
                                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-semibold mt-0.5">
                                    <span>৳{Number(pPrice).toLocaleString('bn-BD')} × {qty}</span>
                                    <span className="text-neutral-700 font-bold">৳{Number(pPrice * qty).toLocaleString('bn-BD')}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </td>

                        {/* Order Total & Payment Method badge */}
                        <td className="px-4 py-3 text-right space-y-2">
                          <div>
                            {getPaymentMethodBadge(o?.paymentMethod || 'Cash on Delivery', lang)}
                          </div>
                          
                          <div className="space-y-0.5">
                            <span className="text-neutral-400 text-[9px] font-semibold block">সর্বমোট পেমেন্ট (৳)</span>
                            <span className="text-[13px] font-black text-rose-650 font-sans tracking-wide text-rose-600 block">
                              ৳{Number(o?.totalAmount || 0).toLocaleString('bn-BD')}
                            </span>
                          </div>
                        </td>

                        {/* Status Label badge */}
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight inline-block ${
                            o.status === OrderStatus.PENDING
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : o.status === OrderStatus.CONFIRMED
                              ? 'bg-sky-100 text-sky-700 border border-sky-200'
                              : o.status === OrderStatus.SHIPPED
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                              : o.status === OrderStatus.DELIVERED
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-700 border border-rose-200'
                          }`}>
                            {o.status === OrderStatus.PENDING && (lang === 'bn' ? 'পেন্ডিং' : 'Pending')}
                            {o.status === OrderStatus.CONFIRMED && (lang === 'bn' ? 'কনফার্মড' : 'Confirmed')}
                            {o.status === OrderStatus.SHIPPED && (lang === 'bn' ? 'শিপড' : 'Shipped')}
                            {o.status === OrderStatus.DELIVERED && (lang === 'bn' ? 'ডেলিভার্ড' : 'Delivered')}
                            {o.status === OrderStatus.CANCELLED && (lang === 'bn' ? 'বাতিলকৃত' : 'Cancelled')}
                          </span>
                        </td>

                        {/* Change Status Dropdown SELECT */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center">
                            <select
                               value={o.status}
                               onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                               className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-neutral-700 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-3xs"
                            >
                              {Object.values(OrderStatus).map(st => (
                                <option key={st} value={st}>
                                  {st === OrderStatus.PENDING && (lang === 'bn' ? 'পেন্ডিং (Pending)' : 'Pending')}
                                  {st === OrderStatus.CONFIRMED && (lang === 'bn' ? 'কনফার্মড (Confirmed)' : 'Confirmed')}
                                  {st === OrderStatus.SHIPPED && (lang === 'bn' ? 'শিপড (Shipped)' : 'Shipped')}
                                  {st === OrderStatus.DELIVERED && (lang === 'bn' ? 'ডেলিভার্ড (Delivered)' : 'Delivered')}
                                  {st === OrderStatus.CANCELLED && (lang === 'bn' ? 'বাতিলকৃত (Cancelled)' : 'Cancelled')}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. USERS MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-neutral-800">কাস্টমার ও ইউজার ম্যানেজমেন্ট</h2>
              <p className="text-xs text-neutral-400">ব্যবহরকারীদের রোলস (জেনারেল বনাম এডমিন) অ্যাডজাস্ট করুন অথবা অ্যাকাউন্ট বাতিল / ব্লক করুন।</p>
            </div>

            {/* Search filter for users */}
            <div className="relative">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="নাম বা ইমেইল দিয়ে ইউজার খুঁজুন..."
                className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
            </div>

            {/* User List Table */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-bold text-neutral-500">
                    <th className="px-4 py-3">ইউজার নাম</th>
                    <th className="px-4 py-3">ইমেইল ঠিকানা</th>
                    <th className="px-4 py-3 text-center">রোলে (Role)</th>
                    <th className="px-4 py-3 text-center">স্ট্যাটাস (Status)</th>
                    <th className="px-4 py-3 text-center">অ্যাকশন পরিবর্তন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-xs text-neutral-400 py-10">কোনো রেজিস্টার্ড ইউজার পাওয়া যায়নি!</td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.id} className="text-xs font-medium text-neutral-700 hover:bg-neutral-50/50">
                        <td className="px-4 py-3 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-700 text-xs shadow-inner">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-800">{u.name}</p>
                            <span className="text-[9px] text-neutral-400">নিবন্ধন: {new Date(u.createdAt).toLocaleDateString('bn-BD')}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono font-medium text-neutral-600">{u.email}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === UserRole.ADMIN
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-0.8 rounded-full text-[10px] font-bold ${
                            u.status === UserStatus.ACTIVE
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-700 border border-rose-200'
                          }`}>
                            {u.status === UserStatus.ACTIVE ? 'Active' : 'Blocked'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            {/* Toggle Role Button */}
                            <button
                              onClick={() => onUpdateUserRole(
                                u.id,
                                u.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN
                              )}
                              className="font-bold text-[9px] bg-neutral-100 border hover:bg-neutral-200 text-neutral-700 px-2 py-1 rounded-md cursor-pointer flex items-center gap-1"
                              title="রোল পরিবর্তন (Admin/User)"
                            >
                              <UserCheck className="w-3 h-3 text-neutral-500" />
                              <span>রোল পরিবর্তন</span>
                            </button>

                            {/* Block Toggle Button */}
                            <button
                              onClick={() => {
                                showConfirm(
                                  u.status === UserStatus.ACTIVE ? (lang === 'en' ? 'Block User' : 'ইউজার ব্লক করুন') : (lang === 'en' ? 'Unblock User' : 'ইউজার আনব্লক করুন'),
                                  u.status === UserStatus.ACTIVE 
                                    ? `আপনি কি সত্যিই "${u.name}" এর অ্যাকাউন্টটি ব্লক করতে চান?` 
                                    : `আপনি কি সত্যিই "${u.name}" এর অ্যাকাউন্টটি আনব্লক করতে চান?`,
                                  () => {
                                    onUpdateUserStatus(
                                      u.id,
                                      u.status === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE
                                    );
                                  },
                                  u.status === UserStatus.ACTIVE
                                );
                              }}
                              className={`font-bold text-[9px] px-2 py-1 rounded-md cursor-pointer flex items-center gap-1 ${
                                u.status === UserStatus.ACTIVE
                                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
                                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
                              }`}
                              title={u.status === UserStatus.ACTIVE ? 'ব্লক করুন' : 'আনব্লক করুন'}
                            >
                              <Ban className="w-3 h-3" />
                              <span>{u.status === UserStatus.ACTIVE ? 'ব্লক' : 'আনব্লক'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============== CUSTOM TAB: USER SIGNUP DATABASE ============== */}
        {activeTab === 'signup_db' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header section with stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200/50 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-indigo-950/70 tracking-wider uppercase">মোট নিবন্ধিত ইউজার</span>
                    <span className="text-xl font-extrabold text-indigo-900 font-sans">{users.length} জন</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-purple-950/70 tracking-wider uppercase">পাসওয়ার্ড রিকভারি অ্যালার্ট</span>
                    <span className="text-xl font-extrabold text-purple-900 font-sans">{forgotAlerts.length} টি</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-emerald-950/70 tracking-wider uppercase">AI সিস্টেম স্ট্যাটাস</span>
                    <span className="text-xs font-bold text-emerald-800 bg-white border border-emerald-300 rounded-full px-2.5 py-0.5 mt-1 inline-block animate-pulse">● রানিং (ACTIVE)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Area: User Signup Registrations */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-neutral-800 flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-600" />
                    <span>ইউজার sinup ডাটাবেজ (User Registry)</span>
                  </h2>
                  <p className="text-xs text-neutral-400">
                    এখানে সমস্ত গ্রাহকদের নাম, ইমেইল, মোবাইল নাম্বার এবং মূল সংরক্ষিত পাসওয়ার্ডগুলি নিরাপদে সারণীবদ্ধ করা রয়েছে।
                  </p>
                </div>

                {/* Search box */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="নাম, ফোন বা ইমেইল খুঁজুন..."
                    value={signupSearch}
                    onChange={(e) => setSignupSearch(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-600 text-neutral-800 focus:bg-white"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-neutral-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-[10px] uppercase text-neutral-500 font-bold border-b border-neutral-100">
                    <tr>
                      <th className="px-5 py-3">ইউজার আইডি (ID)</th>
                      <th className="px-5 py-3">নাম (Name)</th>
                      <th className="px-5 py-3">মোবাইল নাম্বার (Phone)</th>
                      <th className="px-5 py-3">ইমেইল ঠিকানা (Email)</th>
                      <th className="px-5 py-3 text-red-600">পাসওয়ার্ড (Password)</th>
                      <th className="px-5 py-3">রোল (Role)</th>
                      <th className="px-5 py-3">স্ট্যাটাস (Status)</th>
                      <th className="px-5 py-3">সময় (Date)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 select-text">
                    {users.filter(u => 
                      u.name.toLowerCase().includes(signupSearch.toLowerCase()) ||
                      (u.phone && u.phone.includes(signupSearch)) ||
                      u.email.toLowerCase().includes(signupSearch.toLowerCase()) ||
                      u.id.toLowerCase().includes(signupSearch.toLowerCase())
                    ).length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-neutral-400 bg-neutral-50/50 font-medium">
                          কোনো নিবন্ধিত কাস্টমার খুঁজে পাওয়া যায়নি!
                        </td>
                      </tr>
                    ) : (
                      users.filter(u => 
                        u.name.toLowerCase().includes(signupSearch.toLowerCase()) ||
                        (u.phone && u.phone.includes(signupSearch)) ||
                        u.email.toLowerCase().includes(signupSearch.toLowerCase()) ||
                        u.id.toLowerCase().includes(signupSearch.toLowerCase())
                      ).map((u) => (
                        <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-[10px] text-neutral-400">{u.id}</td>
                          <td className="px-5 py-3.5 font-bold text-neutral-800">{u.name}</td>
                          <td className="px-5 py-3.5 font-semibold text-neutral-600 font-sans">{u.phone || 'অপ্রদানকৃত'}</td>
                          <td className="px-5 py-3.5 text-neutral-500 font-sans">{u.email}</td>
                          <td className="px-5 py-3.5">
                            <span className="font-mono bg-red-50 text-red-700 px-2.5 py-1 rounded-lg text-[11px] font-extrabold select-all border border-red-100/40 shadow-xs inline-block">
                              {u.password || 'সরাসরি গুগল লগইন'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                              u.role === UserRole.ADMIN 
                                ? 'bg-indigo-100 text-indigo-700' 
                                : 'bg-neutral-100 text-neutral-700'
                            }`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`w-2 h-2 rounded-full inline-block mr-1.5 ${
                              u.status === UserStatus.ACTIVE ? 'bg-emerald-500' : 'bg-red-500'
                            }`} />
                            <span className="font-medium text-neutral-600">
                              {u.status === UserStatus.ACTIVE ? 'সক্রিয়' : 'ব্লকড'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-neutral-400 font-sans text-[10px]">
                            {new Date(u.createdAt).toLocaleDateString('bn-BD')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 2: AI Forgot Password Recovery Notifications Log */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-neutral-800 flex items-center gap-2 text-md">
                    <Key className="w-5 h-5 text-amber-500" />
                    <span>ভুলে যাওয়া পাসওয়ার্ড রিকুয়েস্ট লগ (Forgot Alerts & Real-time OTPs)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    গ্রাহক পাসওয়ার্ড ভুলে গিয়ে AI রিকভার করার সাথে সাথেই এই লিস্টে নোটিফিকেশন তথ্য রিয়েল-টাইমে জমা হয়।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const saved = localStorage.getItem('anono_forgot_notifications');
                      if (saved) {
                        try {
                          setForgotAlerts(JSON.parse(saved));
                        } catch (e) {}
                      }
                    }}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    রিফ্রেশ করুন
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('আপনি কি সমস্ত ভুলে যাওয়া নোটিফিকেশন লগ ডিলিট করতে চান?')) {
                        localStorage.removeItem('anono_forgot_notifications');
                        setForgotAlerts([]);
                      }
                    }}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    ক্লিয়ার করুন
                  </button>
                </div>
              </div>

              {forgotAlerts.length === 0 ? (
                <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-neutral-400 text-xs">
                  <Bot className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <span>বর্তমানে কোনো অ্যাক্টিভ পাসওয়ার্ড ভুলে যাওয়ার রিকুয়েস্ট নোটিফিকেশন নেই।</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forgotAlerts.map((n) => (
                    <div 
                      key={n.id} 
                      className="bg-neutral-50/60 border border-neutral-200/50 rounded-2xl p-4 flex gap-3 relative overflow-hidden group hover:border-indigo-200 transition-all shadow-2xs"
                    >
                      <div className="absolute top-0 right-0 p-2 text-[8px] bg-amber-500 text-white font-extrabold rounded-bl-xl uppercase tracking-wider">
                        AI Verified Alert
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0 mt-1 shadow-inner">
                        <Phone className="w-5 h-5" />
                      </div>

                      <div className="space-y-1.5 flex-grow font-sans text-xs">
                        <div className="font-bold text-neutral-800 text-sm">{n.userName}</div>
                        <div className="text-neutral-500 font-semibold flex items-center gap-1.5">
                          <span>যোগাযোগ তথ্য:</span>
                          <span className="text-neutral-800 font-mono select-all bg-neutral-200/60 px-1.5 py-0.5 rounded font-bold">{n.emailOrPhone}</span>
                        </div>
                        <div className="text-neutral-500 flex items-center gap-1.5">
                          <span>উৎপন্ন করা লগইন ওটিপি:</span>
                          <span className="text-emerald-700 font-mono font-extrabold select-all bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded text-sm tracking-widest">{n.otp}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 pt-1 flex items-center justify-between">
                          <span>সময়: {new Date(n.createdAt).toLocaleTimeString('bn-BD')}</span>
                          <span className="text-emerald-600 font-extrabold">● AI ওটিপি সাকসেস</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. CAMPAIGN BANNERS MANAGEMENT TAB */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-neutral-800">
                  {lang === 'en' ? 'Campaign Banners Management' : 'হোমপেজে স্লাইড ব্যানার কন্ট্রোল'}
                </h2>
                <p className="text-xs text-neutral-400">
                  {lang === 'en'
                    ? 'Add, delete or configure dynamic campaign banners displayed on the store homepage.'
                    : 'হোমপেজের স্লাইডিং ক্যাম্পেইন ব্যানার যুক্ত করুন, ডিলিট করুন অথবা কনফিগার করুন।'}
                </p>
              </div>

              <button
                onClick={() => setIsBannerFormOpen(!isBannerFormOpen)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isBannerFormOpen
                    ? (lang === 'en' ? 'Close Form' : 'ফর্ম বন্ধ করুন')
                    : (lang === 'en' ? 'Add New Campaign' : 'নতুন ব্যানার যুক্ত করুন')}
                </span>
              </button>
            </div>

            {/* Expansible Banner Creation Form */}
            {isBannerFormOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-neutral-200/60 p-5 md:p-6 shadow-md space-y-4 text-xs"
              >
                <h3 className="font-extrabold text-neutral-800 text-sm border-b pb-2 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <span>{lang === 'en' ? 'Create Interactive Banner Slide' : 'নতুন ক্যাম্পেইন স্লাইড ডেক তৈরি করুন'}</span>
                </h3>

                <form onSubmit={handleBannerSubmit} className="space-y-4">
                  
                  {/* Banner Mode Toggle */}
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBIsFullImage(true)}
                      className={`py-2 px-3 rounded-lg font-bold transition-all text-center ${
                        bIsFullImage
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-700'
                      }`}
                    >
                      {lang === 'en' ? 'Full Image Background (Single Big Banner Picture)' : 'অনুরোধের মতো সম্পূর্ণ চিত্র ব্যানার (Full Banner Image)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBIsFullImage(false)}
                      className={`py-2 px-3 rounded-lg font-bold transition-all text-center ${
                        !bIsFullImage
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-700'
                      }`}
                    >
                      {lang === 'en' ? 'Split Text + Product Photo' : 'স্প্লিট টাইটেল টেক্সট + ডানপাশে ছবি'}
                    </button>
                  </div>

                  {/* Shared Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-neutral-600 block">
                          {lang === 'en' ? 'Banner Image *' : 'ব্যানার ইমেজ *'}
                        </label>
                        
                        {/* Selector Tabs */}
                        <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
                          <button
                            type="button"
                            onClick={() => {
                              setBImageSource('url');
                              setBImageUrl('');
                              setBUploadedFileName('');
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              bImageSource === 'url'
                                ? 'bg-white text-indigo-700 shadow-xs'
                                : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                          >
                            {lang === 'en' ? 'Online URL' : 'অনলাইন লিংক'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setBImageSource('file');
                              setBImageUrl('');
                              setBUploadedFileName('');
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              bImageSource === 'file'
                                ? 'bg-white text-indigo-700 shadow-xs'
                                : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                          >
                            {lang === 'en' ? 'Local Upload' : 'কম্পিউটার ফাইল'}
                          </button>
                        </div>
                      </div>

                      {bImageSource === 'url' ? (
                        <input
                          type="url"
                          required={bImageSource === 'url'}
                          value={bImageUrl.startsWith('data:') ? '' : bImageUrl}
                          onChange={(e) => setBImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      ) : (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleBannerFileChange(file);
                          }}
                          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                            isDragging
                              ? 'border-indigo-500 bg-indigo-50/40'
                              : bImageUrl
                              ? 'border-emerald-400 bg-emerald-50/10'
                              : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/40'
                          }`}
                          onClick={() => {
                            document.getElementById('banner-file-input')?.click();
                          }}
                        >
                          <input
                            id="banner-file-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleBannerFileChange(file);
                            }}
                          />
                          <Upload className={`w-5 h-5 ${bImageUrl ? 'text-emerald-500' : 'text-neutral-400'}`} />
                          
                          <div className="text-[11px] font-semibold text-neutral-600">
                            {bImageUrl ? (
                              <span className="text-emerald-600 font-bold">
                                {lang === 'en' ? '✓ Image Loaded Successfully' : '✓ ইমেজ লোড করা হয়েছে'}
                              </span>
                            ) : (
                              <span>
                                {lang === 'en' 
                                  ? 'Click to browse or Drag & Drop image file' 
                                  : 'ক্লিক করুন অথবা ছবি এখানে ড্র্যাগ করে ছেড়ে দিন'}
                              </span>
                            )}
                          </div>

                          {bUploadedFileName && (
                            <div className="text-[9px] text-neutral-400 max-w-full truncate font-mono bg-neutral-100 px-2 py-0.5 rounded-md mt-0.5">
                              {bUploadedFileName}
                            </div>
                          )}

                          {bImageUrl && bImageUrl.startsWith('data:') && (
                            <div className="mt-1 flex items-center justify-center gap-2">
                              <img 
                                src={bImageUrl} 
                                alt="Local upload preview" 
                                className="h-10 w-auto rounded-md object-cover border border-neutral-200"
                                referrerPolicy="no-referrer"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBImageUrl('');
                                  setBUploadedFileName('');
                                }}
                                className="text-[9px] hover:underline text-rose-500 font-bold"
                              >
                                {lang === 'en' ? 'Remove' : 'মুছে ফেলুন'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <p className="text-[10px] text-neutral-400 mt-1.5">
                        {bIsFullImage
                          ? (lang === 'en' ? 'Provide a wide-aspect layout banner image' : '১ম ব্যানারের মতো একটি চমৎকার চওড়া ব্যানার ইমেজ দিন, যা পুরো স্ক্রিন জুড়ে আসবে।')
                          : (lang === 'en' ? 'Provide a standalone product photo on transparent background' : 'একটি ব্যাকগ্রাউন্ড ছাড়া সুন্দর পিএনজি/জেপিজি প্রোডাক্ট ইমেজ দিন।')}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-600 block mb-1">
                        {lang === 'en' ? 'Link Category (Filter when clicked)' : 'কানেক্টিং ক্যাটাগরি ফিল্টার (ব্যানারে ক্লিক করলে এটি লোড হবে)'}
                      </label>
                      <select
                        value={bCategory}
                        onChange={(e) => setBCategory(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Split mode custom attributes */}
                  {!bIsFullImage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 border-t pt-4"
                    >
                      {/* Badge and Title fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-600 block">ক্যাম্পেইন স্মল ব্যাজ (বাংলা ও ইংরেজি)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={bBadgeBn}
                              onChange={(e) => setBBadgeBn(e.target.value)}
                              placeholder="মেগা অফার 🌟"
                              className="w-1/2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                            <input
                              type="text"
                              value={bBadgeEn}
                              onChange={(e) => setBBadgeEn(e.target.value)}
                              placeholder="MEGA SAVINGS!"
                              className="w-1/2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-600 block">ব্যানার মেইন টাইটেল (বাংলা ও ইংরেজি)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={bTitleBn}
                              onChange={(e) => setBTitleBn(e.target.value)}
                              placeholder="অনন্য লাইফস্টাইল পণ্য!"
                              className="w-1/2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                            <input
                              type="text"
                              value={bTitleEn}
                              onChange={(e) => setBTitleEn(e.target.value)}
                              placeholder="Unbelievable Lifestyle!"
                              className="w-1/2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subtitle and content details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-600 block">ছোট সাব-হেডিং (বাংলা ও ইংরেজি)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={bSubtitleBn}
                              onChange={(e) => setBSubtitleBn(e.target.value)}
                              placeholder="সেরা ব্র্যান্ড সব এখন হাতের মুঠোয়"
                              className="w-1/2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                            <input
                              type="text"
                              value={bSubtitleEn}
                              onChange={(e) => setBSubtitleEn(e.target.value)}
                              placeholder="Your favorite top gadgets are now here"
                              className="w-1/2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-600 block">ছোট বিবরণী প্যারাগ্রাফ (বাংলা ও ইংরেজি)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={bContentBn}
                              onChange={(e) => setBContentBn(e.target.value)}
                              placeholder="আজই কিনুন ও ২০% ক্যাশব্যাক ভাউচার উপভোগ করুন!"
                              className="w-1/2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                            <input
                              type="text"
                              value={bContentEn}
                              onChange={(e) => setBContentEn(e.target.value)}
                              placeholder="Shop today and get a personalized 20% refund promo voucher."
                              className="w-1/2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Discount value label and background preset picker */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-600 block">ডিসকাউন্ট ব্যাজ টেক্সট (বাংলা ও ইংরেজি)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={bDiscountBn}
                              onChange={(e) => setBDiscountBn(e.target.value)}
                              placeholder="২০% ছাড়"
                              className="w-1/2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                            <input
                              type="text"
                              value={bDiscountEn}
                              onChange={(e) => setBDiscountEn(e.target.value)}
                              placeholder="20% OFF"
                              className="w-1/2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-600 block">ব্যানার কালার ব্যাকগ্রাউন্ড টোন</label>
                          <select
                            value={bBgPreset}
                            onChange={(e) => setBBgPreset(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          >
                            <option value="bg-gradient-to-r from-[#d2f6f4] via-white to-[#ffe5d4]">রংধনু হালকা স্প্লিট (Default Teal-Orange)</option>
                            <option value="bg-gradient-to-r from-orange-100 via-orange-50 to-orange-200">উজ্জ্বল সোনালী অরেঞ্জ (Orange Burst)</option>
                            <option value="bg-gradient-to-r from-purple-100 via-white to-pink-100">অভিজাত ল্যাভেন্ডার বেগুনি (Purple Luxury)</option>
                            <option value="bg-gradient-to-r from-emerald-100 via-emerald-50 to-teal-100">ফ্রেশ মিন্ট সবুজ (Emerald Fresh)</option>
                            <option value="bg-gradient-to-r from-sky-100 via-white to-blue-100">আকাশী কুয়াশাচ্ছন্ন নীল (Sky Serene)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-600 block">ডিসকাউন্ট ব্যাজ কালার থিম</label>
                          <select
                            value={bDiscountBg}
                            onChange={(e) => setBDiscountBg(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          >
                            <option value="bg-purple-600 text-white">গভীর বেগুনি (Rose Purple)</option>
                            <option value="bg-rose-600 text-white">আগুনে লাল (Crimson Fire Red)</option>
                            <option value="bg-amber-500 text-black">উজ্জ্বল আম্বার হলুদ (Active Amber)</option>
                            <option value="bg-neutral-900 text-white">গাঢ় চারকোল (Minimal Charcoal)</option>
                          </select>
                        </div>
                      </div>

                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-600 block mb-1">ব্যানার সার্চ কিওয়ার্ড (সার্চ বার ফিল্টার - ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={bSearchQuery}
                      onChange={(e) => setBSearchQuery(e.target.value)}
                      placeholder="যেমন: Earbuds, Watch, etc."
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsBannerFormOpen(false)}
                      className="w-1/3 bg-neutral-100 text-neutral-700 border border-neutral-200 font-bold py-2.5 rounded-xl hover:bg-neutral-200 cursor-pointer"
                    >
                      {lang === 'en' ? 'Cancel' : 'বাতিল'}
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 shadow-md transition-all cursor-pointer"
                    >
                      {lang === 'en' ? 'Publish Campaign Banner' : 'ক্যাম্পেইন স্লাইড রিলিজ করুন'}
                    </button>
                  </div>

                </form>
              </motion.div>
            )}

            {/* List and manage current active banners */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
              <div className="bg-neutral-50/60 p-4 border-b border-neutral-100 flex justify-between items-center">
                <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">
                  {lang === 'en' ? 'Store Carousel Slides' : 'অ্যাক্টিভ সাইট ব্যানার্স'}
                </span>
                <span className="bg-indigo-50 text-indigo-700 font-bold rounded-full px-2.5 py-0.5 text-[10px]">
                  {banners.length} {lang === 'en' ? 'Slides Online' : 'টি ব্যানার সচল রয়েছে'}
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {banners.length === 0 ? (
                  <div className="text-center py-12 text-xs text-neutral-400 space-y-2">
                    <p>{lang === 'en' ? 'No campaign banners are currently active.' : 'বর্তমানে কোনো ক্যাম্পেইন ব্যানার সচল নেই।'}</p>
                    <p className="text-[10px] text-neutral-400">
                      {lang === 'en'
                        ? 'Users will experience an empty banner section unless you publish banners.'
                        : 'হোমপেজে ব্যানার দেখতে অনুগ্রহ করে উপরে একটি ব্যানার তৈরি করুন।'}
                    </p>
                  </div>
                ) : (
                  banners.map((b, idx) => (
                    <div key={b.id} className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 hover:bg-neutral-50/20 transition-all">
                      <div className="flex items-center gap-3.5">
                        {/* Avatar of original or loaded image */}
                        <div className="w-20 h-12 bg-neutral-100 rounded-xl border relative overflow-hidden flex items-center justify-center shadow-xs flex-shrink-0">
                          <img
                            src={b.imageUrl}
                            alt="Campaign thumbnail"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {b.isFullImage && (
                            <span className="absolute bottom-0 right-0 bg-neutral-950/85 text-[7px] text-white font-extrabold px-1 rounded-sm uppercase tracking-tighter">
                              Full Img
                            </span>
                          )}
                        </div>

                        {/* Banner text info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black text-neutral-400 font-mono uppercase tracking-wider">
                              #{idx + 1} ID: {b.id}
                            </span>
                            {idx === 0 && (
                              <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                                {lang === 'en' ? 'Active First' : 'চলতি ১ম ব্যানার'}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-xs font-black text-neutral-700 truncate leading-normal max-w-xs md:max-w-md">
                            {b.isFullImage 
                              ? (lang === 'en' ? `Full image campaign for category: ${b.category}` : `পূর্ণাঙ্গ বিজ্ঞাপন ব্যানার - ক্যাটাগরি: ${b.category}`)
                              : (lang === 'en' ? `Split Promo: ${b.title.en}` : `বিভক্ত টাইটেল: ${b.title.bn}`)
                            }
                          </h4>

                          <p className="text-[9px] text-neutral-400 flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span>
                              🎯 ক্যাটাগরি ফিল্টার: <strong className="text-neutral-600 font-bold">{b.category}</strong>
                            </span>
                            {b.searchQuery && (
                              <>
                                <span className="text-neutral-300">•</span>
                                <span>
                                  🔍 সার্চ কিওয়ার্ড: <strong className="text-neutral-600 font-mono font-bold">{b.searchQuery}</strong>
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Delete actions */}
                      <div className="flex items-center gap-1.5 self-end md:self-auto">
                        {deletingBannerId === b.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteBanner(b.id);
                                setDeletingBannerId(null);
                              }}
                              className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold font-sans transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{lang === 'en' ? 'Yes, Delete' : 'হ্যাঁ, ডিলিট'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingBannerId(null)}
                              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2.5 py-1.5 rounded-xl text-[10px] font-bold font-sans transition-all cursor-pointer border border-neutral-200"
                            >
                              <span>{lang === 'en' ? 'Cancel' : 'বাতিল'}</span>
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              // Set this banner ID as currently deleting to trigger confirmation
                              setDeletingBannerId(b.id);
                            }}
                            className="bg-rose-50 border border-rose-100 hover:bg-rose-150 text-rose-650 hover:text-rose-700 px-3 py-1.5 rounded-xl text-[10px] font-bold font-sans transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === 'en' ? 'Delete' : 'ডিলিট ব্যানার'}</span>
                          </button>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Global reset safeties */}
            <div className="bg-indigo-50/50 rounded-2xl border border-indigo-150 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="font-extrabold text-indigo-900 text-xs flex items-center justify-center md:justify-start gap-1">
                  <span>💡</span>
                  <span>{lang === 'en' ? 'Quick Store Reset Controls' : 'কুইক ব্যানার রিসেট মেকানিজম'}</span>
                </h4>
                <p className="text-[10px] text-indigo-700 leading-normal max-w-xl font-medium">
                  {lang === 'en'
                    ? 'Easily return back to the standard ANONO default image Campaign slide in case you accidentally deleted it.'
                    : 'ভুলবশত সব ব্যানার ডিলিট করে ফেললে আপনি মাত্র এক ক্লিকে সাইটের মেগা ক্যাম্পেইনের ১ম ব্যানারটি পুনরুদ্ধার করতে পারবেন।'}
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  showConfirm(
                    lang === 'en' ? 'Reset Banners' : 'ব্যানার রিসেত নিশ্চিত করুন',
                    lang === 'en' ? 'Do you want to reset banners to pre-configured defaults?' : 'আপনি কি ব্যানার কনফিগারেশন পূর্বনির্ধারিত ডিফল্ট ১ম ব্যানারে রিসেট করতে চান?',
                    () => {
                      localStorage.removeItem('anono_banners');
                      window.location.reload();
                    },
                    false
                  );
                }}
                className="bg-white hover:bg-neutral-50 text-indigo-700 border border-indigo-200 hover:border-indigo-300 shadow-sm text-[10px] font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Restore Default Banner' : 'ডিফল্ট ব্যানার ফেরত আনুন'}</span>
              </button>
            </div>

          </div>
        )}

        {/* ===================== VIEW - BRANDING & SETTINGS ===================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Title block */}
            <div>
              <h2 className="text-xl font-extrabold text-neutral-800">
                {lang === 'en' ? 'Branding & Store Settings' : 'স্টোর ও ব্র্যান্ডিং সেটিংস'}
              </h2>
              <p className="text-xs text-neutral-400">
                {lang === 'en' 
                  ? 'Manage your e-commerce store brand identity, name, and live logo icon configurations.'
                  : 'আপনার ই-কমার্স স্টোরের নাম, লোগো এবং ব্র্যান্ড পরিচয় পরিবর্তন ও নিয়ন্ত্রণ করুন।'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Form Settings */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Store Name Configuration Card */}
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-neutral-100 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-neutral-800 flex items-center gap-1.5 border-b border-neutral-50 pb-2">
                    <span className="text-indigo-650">🏷️</span>
                    <span>{lang === 'en' ? 'Website Display Name' : 'ওয়েবসাইটের নাম পরিবর্তন'}</span>
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-600 block">
                      {lang === 'en' ? 'Store Name (e-commerce Name)' : 'ই-কমার্স বা শপের নাম/ব্র্যান্ড'}
                    </label>
                    <input
                      type="text"
                      value={websiteName}
                      onChange={(e) => {
                        if (e.target.value.trim()) {
                          onUpdateWebsiteName(e.target.value);
                        } else {
                          onUpdateWebsiteName('ANONO');
                        }
                      }}
                      placeholder="যেমন: ANONO, Shop, Brand"
                      className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-neutral-800 transition-all font-sans"
                    />
                    <p className="text-[10px] text-neutral-400 font-medium">
                      {lang === 'en'
                        ? 'This name is used in key sections: Navbar title, footer, copy-writing, headings, and SEO headers.'
                        : 'এই নামটি সাইটের প্রতিটি অংশ যেমন হেডার, ফুটার, কপিরাইট, রিয়েলটাইম মেসেজ ইত্যাদিতে ব্যবহৃত হবে।'}
                    </p>
                  </div>
                </div>

                {/* Store Logo Configuration Card */}
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-neutral-100 shadow-xs space-y-5">
                  <h3 className="text-sm font-extrabold text-neutral-800 flex items-center gap-1.5 border-b border-neutral-50 pb-2">
                    <span className="text-indigo-650">🎨</span>
                    <span>{lang === 'en' ? 'Website Logo Icon' : 'ওয়েবসাইটের লোগো পরিবর্তন'}</span>
                  </h3>

                  {/* Mode Selector */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => onUpdateWebsiteLogo('')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${
                          !websiteLogo
                            ? 'border-indigo-500 bg-indigo-50/30 text-indigo-700 font-extrabold'
                            : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-bold'
                        }`}
                      >
                        <span className="text-lg mb-1">📐</span>
                        <span className="text-xs">{lang === 'en' ? 'Default 3D SVG' : 'ডিফল্ট ৩ডি লোগো'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!websiteLogo) {
                            onUpdateWebsiteLogo('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80');
                          }
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${
                          websiteLogo
                            ? 'border-indigo-500 bg-indigo-50/30 text-indigo-700 font-extrabold'
                            : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-bold'
                        }`}
                      >
                        <span className="text-lg mb-1">🖼️</span>
                        <span className="text-xs">{lang === 'en' ? 'Custom Logo' : 'কাস্টম ছবি লোগো'}</span>
                      </button>
                    </div>

                    {websiteLogo !== '' && (
                      <div className="space-y-4 pt-2">
                        {/* 1. Paste URL option */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-600 block">
                            {lang === 'en' ? 'Logo Image Direct URL' : 'লোগো ছবির ডিরেক্ট লিংক (URL)'}
                          </label>
                          <input
                            type="text"
                            value={websiteLogo.startsWith('data:') ? '' : websiteLogo}
                            onChange={(e) => onUpdateWebsiteLogo(e.target.value)}
                            placeholder="https://example.com/logo.png"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-indigo-500 font-mono"
                          />
                        </div>

                        {/* 2. Drag & Drop or Click Upload option */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-600 block">
                            {lang === 'en' ? 'Or, Upload Image File' : 'অথবা, নতুন লোগো ছবি আপলোড করুন'}
                          </label>
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const files = e.dataTransfer.files;
                              if (files && files[0]) {
                                const file = files[0];
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (reader.result && typeof reader.result === 'string') {
                                    onUpdateWebsiteLogo(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="border-2 border-dashed border-neutral-200 hover:border-indigo-400 rounded-2xl bg-neutral-50/50 hover:bg-neutral-50 p-6 text-center transition-all group cursor-pointer relative"
                            onClick={() => {
                              const fileInput = document.getElementById('logo-file-picker') as HTMLInputElement;
                              if (fileInput) fileInput.click();
                            }}
                          >
                            <input
                              type="file"
                              id="logo-file-picker"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files && files[0]) {
                                  const file = files[0];
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (reader.result && typeof reader.result === 'string') {
                                      onUpdateWebsiteLogo(reader.result);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <div className="space-y-2 pointer-events-none">
                              <div className="w-10 h-10 bg-indigo-50 border border-indigo-150 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                                <Upload className="w-5 h-5" />
                              </div>
                              <p className="text-xs font-extrabold text-neutral-700">
                                {lang === 'en' ? 'Click to upload or drag image here' : 'ক্লিক করে আপনার লোগো ফাইলটি সিলেক্ট করুন বা ড্র্যাগ করে ছাড়ুন'}
                              </p>
                              <p className="text-[10px] text-neutral-400 max-w-xs mx-auto leading-normal">
                                {lang === 'en' ? 'Supports JPG, PNG, GIF or SVG. Square size is recommended.' : 'PNG, JPG, SVG অথবা ক্ষণস্থায়ী জিআইএফ সাপোর্ট করে। চারকোণা ছবির লোগো দেখতে সবচেয়ে সুন্দর মানায়।'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Preview Panel */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-neutral-100 shadow-xs space-y-5 sticky top-24">
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-wider border-b border-neutral-50 pb-2">
                    {lang === 'en' ? 'Real-Time Branding Preview' : 'রিয়েল-টাইম ব্র্যান্ড প্রিভিউ'}
                  </h3>

                  {/* Preview Container */}
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex flex-col items-center justify-center text-center py-8 space-y-4 relative overflow-hidden">
                    <span className="absolute top-2 left-2 bg-indigo-150 text-indigo-850 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">
                      Live Preview
                    </span>

                    {/* Logo display */}
                    <div className="w-16 h-16 bg-white rounded-2xl border border-neutral-100 flex items-center justify-center shadow-md p-1.5 relative group overflow-hidden">
                      {websiteLogo ? (
                        <img 
                          src={websiteLogo} 
                          alt="Custom Branding Logo" 
                          className="w-full h-full object-cover rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center">
                          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm filter">
                            <defs>
                              <linearGradient id="tealRibbonP" x1="15%" y1="90%" x2="55%" y2="10%">
                                <stop offset="0%" stopColor="#14b8a6" />
                                <stop offset="50%" stopColor="#0d9488" />
                                <stop offset="100%" stopColor="#06b6d4" />
                              </linearGradient>
                              <linearGradient id="blueRibbonP" x1="45%" y1="15%" x2="95%" y2="85%">
                                <stop offset="0%" stopColor="#0284c7" />
                                <stop offset="60%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#4f46e5" />
                              </linearGradient>
                            </defs>
                            <path d="M 40 85 C 24 85 15 54 32 45 C 45 38 52 52 60 18 C 61 14 65 14 66 18 C 72 40 82 72 92 88" stroke="url(#tealRibbonP)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M 52 65 C 56 61 72 58 84 74 C 94 87 106 84 106 68 C 106 48 84 42 74 54 L 46 88" stroke="url(#blueRibbonP)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Logo type badge */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black tracking-widest text-neutral-400 font-mono uppercase block">
                        {websiteLogo ? 'CUSTOM LOGO EFFECTIVE' : 'DEFAULT 3D SVG LOGO'}
                      </span>
                      <h4 className="text-lg font-extrabold text-neutral-800 leading-none">
                        {websiteName}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-medium">
                        {lang === 'en' ? 'Pure E-Commerce System' : 'বিশুদ্ধ কমার্স সিস্টেম'}
                      </p>
                    </div>
                  </div>

                  {/* Informative Help card */}
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-[11px] leading-relaxed text-indigo-700 font-medium">
                    <p className="flex items-center gap-1 font-bold text-indigo-900 mb-1">
                      <span>📌</span>
                      <span>{lang === 'en' ? 'Fast Updates Control' : 'তাত্ক্ষণিক পরিবর্তন'}</span>
                    </p>
                    {lang === 'en'
                      ? 'The website name and logo are updated immediately in the frontend. No server reloads are needed!'
                      : 'আপনি এখানে যা পরিবর্তন করবেন তা সাথে সাথেই সারা ওয়েবসাইটে কার্যকর হবে এবং নতুন ব্র্যান্ডিংয়ে ক্রেতারা আকৃষ্ট হবে।'}
                  </div>

                  {/* Reset branding */}
                  <button
                    type="button"
                    onClick={() => {
                      showConfirm(
                        lang === 'en' ? 'Restore Branding' : 'ব্র্যান্ডিং রিসেট করতে চান?',
                        lang === 'en' ? 'Would you like to restore default website name and logo settings?' : 'আপনি কি ওয়েবসাইটের নাম ও লোগো পুনরুদ্ধার করে ডিফল্ট সেটিংসে ফিরিয়ে নিতে চান?',
                        () => {
                          onUpdateWebsiteName('ANONO');
                          onUpdateWebsiteLogo('');
                          showAlert(
                            lang === 'en' ? 'Restored' : 'পুনরুদ্ধার সম্পন্ন',
                            lang === 'en' ? 'Website branding restored to defaults.' : 'ওয়েবসাইটের নাম ও লোগো সফলভাবে ডিফল্ট সেটিংসে ফিরিয়ে নেওয়া হয়েছে।',
                            'success'
                          );
                        },
                        false
                      );
                    }}
                    className="w-full bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-colors text-center"
                  >
                    {lang === 'en' ? 'Reset to Default BRANDING' : 'ডিফল্ট ব্র্যান্ডিংয়ে রিসেট করুন'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. DYNAMIC CATEGORIES MANAGER PANEL */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Title block */}
            <div>
              <h2 className="text-xl font-extrabold text-neutral-800">
                {lang === 'en' ? 'Category Manager' : 'ক্যাটাগরি সমাধান ও নিয়ন্ত্রণ'}
              </h2>
              <p className="text-xs text-neutral-400">
                {lang === 'en'
                  ? 'Add new product category tags, delete unused categories, and track total item counts.'
                  : 'নতুন ক্যাটাগরি তৈরি করুন, অপ্রয়োজনীয় ক্যাটাগরি মুছে দিন এবং পণ্যগুলোর সঠিক বিভাজন নিশ্চিত করুন।'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column: Add Category form */}
              <div className="space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCategoryName.trim()) {
                      showAlert(
                        lang === 'en' ? 'Blank Input' : 'খালি নাম',
                        lang === 'en' ? 'Please type a valid category name!' : 'দয়া করে একটি সঠিক ক্যাটাগরি নাম লিখুন!',
                        'error'
                      );
                      return;
                    }
                    onAddCategory(newCategoryName.trim());
                    setNewCategoryName('');
                  }}
                  className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-xs space-y-4"
                >
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 pb-1 border-b">
                    <Plus className="w-4 h-4 text-indigo-500" />
                    <span>{lang === 'en' ? 'Add New Category' : 'নতুন ক্যাটাগরি যুক্ত করুন'}</span>
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-600 block">
                      {lang === 'en' ? 'Category Name' : 'ক্যাটাগরির নাম (বাংলা ও ইংরেজি মিশ্রিত হলে ভালো)'}
                    </label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g. Electronics (ইলেকট্রনিক্স)' : 'যেমন: ইলেকট্রনিক্স (Electronics)'}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-bold transition-all"
                    />
                    <p className="text-[10px] text-neutral-400 font-medium">
                      {lang === 'en'
                        ? 'Keep it clear. It will appear on store filters and product listings.'
                        : 'সহজ ও স্পষ্ট নাম লিখুন, যা সাইটের ফিল্টারিং ও প্রোডাক্টের তথ্যে প্রদর্শিত হবে।'}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl cursor-pointer text-xs shadow-md transition-colors"
                  >
                    {lang === 'en' ? 'Create Category' : 'ক্যাটাগরি তৈরি করুন'}
                  </button>
                </form>

                {/* Helpful Tip */}
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100 text-[11px] leading-relaxed text-amber-850 space-y-1">
                  <p className="font-bold text-amber-900 flex items-center gap-1">
                    <span>💡</span>
                    <span>{lang === 'en' ? 'Protip for Admins' : 'অ্যাডমিনদের জন্য পরামর্শ'}</span>
                  </p>
                  <p>
                    {lang === 'en'
                      ? 'Deleting a category removes its filter. Existing products with that category are kept on default listings.'
                      : 'একটি ক্যাটাগরি ডিলিট করলে স্টোরের ফিল্টার তালিকা থেকে সেটি মুছে যাবে, তবে পূর্বে ঐ ক্যাটাগরিতে থাকা প্রোডাক্টগুলো বহাল থাকবে।'}
                  </p>
                </div>
              </div>

              {/* Right column: Categories Table List */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
                <div className="p-4 bg-neutral-50/50 border-b border-neutral-100 flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-neutral-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <Tags className="w-4 h-4 text-neutral-500" />
                    <span>{lang === 'en' ? 'Store Categories List' : 'বর্তমান ক্যাটারগিস তালিকা'}</span>
                  </h3>
                  <span className="text-[10px] bg-neutral-200 text-neutral-700 font-extrabold font-mono px-2 py-0.5 rounded-full">
                    {categories.length} Total
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 overflow-y-auto max-h-[450px]">
                  {categories.map((cat, idx) => {
                    // Count how many products are currently in this category
                    const prodCount = products.filter((p) => p.category === cat).length;
                    const isDefault = cat === 'সব প্রোডাক্ট (All)';

                    return (
                      <div key={idx} className="flex justify-between items-center p-4 hover:bg-neutral-50 transition-colors">
                        <div className="space-y-0.5">
                          <p className="text-xs font-extrabold text-neutral-800 flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-neutral-400 font-mono w-4">{idx + 1}.</span>
                            <span>{cat}</span>
                            {isDefault && (
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-150 text-[9px] px-1.5 py-0.5 rounded-md font-bold">
                                {lang === 'en' ? 'Default Catalog' : 'ডিফল্ট ক্যাটালগ'}
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-semibold pl-5 font-sans">
                            {lang === 'en'
                              ? `${prodCount} products assigned`
                              : `${prodCount} টি প্রোডাক্ট যুক্ত আছে`}
                          </p>
                        </div>

                        {!isDefault && (
                          <button
                            type="button"
                            onClick={() => {
                              showConfirm(
                                lang === 'en' ? 'Confirm Deletion' : 'ডিলিট করতে চান?',
                                lang === 'en'
                                  ? `Are you sure you want to delete the category "${cat}"? Products in it won't be deleted but will fallback.`
                                  : `আপনি কি আসলেই "${cat}" ক্যাটাগরি ডিলিট করতে চান? এতে পণ্যগুলো ডিলিট হবে না, তবে এই ক্যাটাগরি ফিল্টারটি মুছে যাবে।`,
                                () => {
                                  onDeleteCategory(cat);
                                  showAlert(
                                    lang === 'en' ? 'Category Deleted' : 'মুছে ফেলা হয়েছে',
                                    lang === 'en' ? `"${cat}" category deleted successfully.` : `"${cat}" ক্যাটাগরি সম্পূর্ণ মুছে ফেলা হয়েছে।`,
                                    'success'
                                  );
                                },
                                true
                              );
                            }}
                            className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                            title={lang === 'en' ? 'Delete Category' : 'ক্যাটাগরি মুছুন'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* B. MULTI-LEVEL NESTED HIERARCHY MANAGER */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-100 gap-4">
                <div>
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-indigo-505 text-indigo-600" />
                    <span>{lang === 'en' ? 'Nested Category & Hierarchy Editor' : 'বহু-স্তরের ক্যাটাগরি ও সাব-ক্যাটাগরি সমাধান'}</span>
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    {lang === 'en'
                      ? 'Select an overriding Parent Segment, then define detailed Subcategories and deeper Sub-subcategories.'
                      : 'প্রথমে মূল প্যারেন্ট সেগমেন্ট সিলেক্ট করুন। can ওর অধীনে সাব-ক্যাটাগরি এবং তার ভেতরে ইনার উপক্যাটাগরি যুক্ত বা ডিলিট করুন।'}
                  </p>
                </div>

                {/* Dropdown to pick Parent Category */}
                <div className="flex items-center gap-2 min-w-[280px]">
                  <span className="text-xs font-bold text-neutral-500 shrink-0">
                    {lang === 'en' ? 'Parent Category:' : 'মূল সেগমেন্ট:'}
                  </span>
                  <select
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-black text-neutral-750 focus:outline-none focus:border-indigo-500"
                  >
                    {nestedCategories.map((p, idx) => (
                      <option key={p.id} value={p.id}>
                        {p.icon} {lang === 'en' ? p.nameEn : p.nameBn} ({p.mappedCategory ? p.mappedCategory.split(' ')[0] : ''})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subcategories Layout */}
              {selectedParentId && (() => {
                const activeParent = nestedCategories.find(p => p.id === selectedParentId);
                if (!activeParent) return null;

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left Block: Add new subcategory to active parent */}
                      <div className="bg-neutral-50/50 p-5 rounded-2xl border border-neutral-100 space-y-4">
                        <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b">
                          <Plus className="w-4 h-4 text-indigo-500" />
                          <span>{lang === 'en' ? 'New Subcategory' : 'নতুন সাব-ক্যাটাগরি যুক্ত করুন'}</span>
                        </h4>

                        <form onSubmit={handleAddSubcategory} className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block">
                              {lang === 'en' ? 'Subcategory Name (English)' : 'সাব-ক্যাটাগরি নাম (ইংরেজিতে)'}
                            </label>
                            <input
                              type="text"
                              value={subEnInput}
                              onChange={(e) => setSubEnInput(e.target.value)}
                              placeholder="e.g. Shoes"
                              className="w-full bg-white border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block">
                              {lang === 'en' ? 'Subcategory Name (Bengali)' : 'সাব-ক্যাটাগরি নাম (বাংলায়)'}
                            </label>
                            <input
                              type="text"
                              value={subBnInput}
                              onChange={(e) => setSubBnInput(e.target.value)}
                              placeholder="যেমন: জুতো"
                              className="w-full bg-white border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            {lang === 'en' ? 'Create Subcategory' : 'যুক্ত করুন'}
                          </button>
                        </form>
                      </div>

                      {/* Right Block: Active Subcategories tree with nested sub-subcategories */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-100">
                          <h4 className="text-xs font-bold text-neutral-700">
                            {lang === 'en' ? 'Current Subcategories List' : 'বর্তমান সাব-ক্যাটাগরিস তালিকা'}
                          </h4>
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                            {(activeParent.subcategories || []).length} Subcategories
                          </span>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                          {(activeParent.subcategories || []).length === 0 ? (
                            <div className="text-center py-10 bg-neutral-50/20 border border-neutral-100 rounded-2xl">
                              <p className="text-xs text-neutral-400 font-semibold mb-1">
                                {lang === 'en' ? 'No subcategories yet!' : 'কোনো সাব-ক্যাটাগরি পাওয়া যায়নি!'}
                              </p>
                              <p className="text-[10px] text-neutral-400">
                                {lang === 'en' ? 'Use the left form to add your first subcategory.' : 'বাম পাশের ফর্মটি ব্যবহার করে নতুন সাব-ক্যাটাগরি যুক্ত করুন।'}
                              </p>
                            </div>
                          ) : (
                            (activeParent.subcategories || []).map((sub, sIdx) => (
                              <div key={sIdx} className="bg-white border border-neutral-150/60 rounded-2xl p-4 shadow-2xs space-y-3 hover:border-neutral-200 transition-all">
                                
                                {/* Subcategory Header */}
                                <div className="flex justify-between items-center pb-2 border-b border-neutral-50">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-mono text-neutral-400 font-bold">1.{sIdx+1}</span>
                                    <h5 className="text-xs font-black text-neutral-800">
                                      {sub.nameBn} <span className="text-neutral-400 font-bold">({sub.nameEn})</span>
                                    </h5>
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      showConfirm(
                                        lang === 'en' ? 'Delete Subcategory' : 'সাব-ক্যাটাগরি মুছবেন?',
                                        lang === 'en' 
                                          ? `Are you sure you want to delete the subcategory "${sub.nameEn}" and offshoot items?`
                                          : `আপনি কি আসলেই "${sub.nameBn}" সাব-ক্যাটাগরি ডিলিট করতে চান?`,
                                        () => handleDeleteSubcategory(sub.nameEn)
                                      );
                                    }}
                                    className="p-1 px-2 text-[10px] font-bold text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                  >
                                    {lang === 'en' ? 'Delete' : 'মুছুন'}
                                  </button>
                                </div>

                                {/* Deep Sub-subcategories (উপ-উপক্যাটাগরি) rendering */}
                                <div className="pl-4 space-y-3 border-l-2 border-indigo-100">
                                  <div className="flex flex-wrap gap-1.5 items-center">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block py-0.5 mr-2">
                                      {lang === 'en' ? 'Inner Sub-Subcategories:' : 'উপ-উপক্যাটাগরি:'}
                                    </span>
                                    {(sub.subSubcategories || []).length === 0 ? (
                                      <span className="text-[10px] italic text-neutral-400 font-medium select-none bg-neutral-50 px-2.5 py-0.5 rounded-md border border-neutral-100">
                                        No nested sub-subcategories yet
                                      </span>
                                    ) : (
                                      (sub.subSubcategories || []).map((ss, ssIdx) => (
                                        <div key={ssIdx} className="flex items-center gap-1.5 bg-indigo-50/50 border border-indigo-100/60 text-indigo-750 px-2 py-0.5 rounded-lg text-[10px] font-extrabold shadow-3xs hover:bg-indigo-50 transition-colors bg-white">
                                          <span>{ss.nameBn} ({ss.nameEn})</span>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteSubSubcategory(sub.nameEn, ss.nameEn)}
                                            className="ml-1 text-indigo-400 hover:text-rose-600 outline-none cursor-pointer p-0.5"
                                            title={lang === 'en' ? 'Remove Sub-subcategory' : 'উপ-উপক্যাটাগরি মুছুন'}
                                          >
                                            &times;
                                          </button>
                                        </div>
                                      ))
                                    )}
                                  </div>

                                  {/* Quick add layout for Sub-subcategory */}
                                  <div className="bg-neutral-50/30 p-2.5 rounded-xl border border-dashed border-neutral-150 flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={subSubEnInputs[sub.nameEn] || ''}
                                      onChange={(e) => setSubSubEnInputs(prev => ({ ...prev, [sub.nameEn]: e.target.value }))}
                                      placeholder={lang === 'en' ? 'Add Inner Sub (en)...' : 'ইনার উপক্যাটাগরি (ইংরেজিতে)...'}
                                      className="flex-1 bg-white border border-neutral-200 focus:outline-none rounded-lg px-2.5 py-1 text-[10px] font-semibold"
                                    />
                                    <input
                                      type="text"
                                      value={subSubBnInputs[sub.nameEn] || ''}
                                      onChange={(e) => setSubSubBnInputs(prev => ({ ...prev, [sub.nameEn]: e.target.value }))}
                                      placeholder={lang === 'en' ? 'Add Inner Sub (bn)...' : 'ইনার উপক্যাটাগরি (বাংলায়)...'}
                                      className="flex-1 bg-white border border-neutral-200 focus:outline-none rounded-lg px-2.5 py-1 text-[10px] font-semibold"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleAddSubSubcategory(sub.nameEn)}
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-3 py-1 rounded-lg shadow-sm cursor-pointer transition-colors"
                                    >
                                      {lang === 'en' ? 'Add' : 'যুক্ত করুন'}
                                    </button>
                                  </div>
                                </div>

                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* 8. RAW DATABASE & SEARCH INDEX CONTROL CENTER */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            {/* Title Block */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <h2 className="text-xl font-extrabold text-neutral-800">
                  {lang === 'en' ? 'E-Commerce Database & Search Index Manager' : 'ই-কমার্স ডাটাবেজ ও সার্চ ইঞ্জিন কন্ট্রোল'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {lang === 'en' 
                    ? 'Inspect, backup, edit local databases in JSON or analyze raw Elasticsearch token parameters.' 
                    : 'ডাটাবেজের টেবিলগুলো সরাসরি JSON ফরম্যাটে এডিট/ব্যাকআপ করুন এবং ইলাস্টিকসার্চ ইনডেক্সিং প্যারামিটার পর্যবেক্ষণ করুন।'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  showConfirm(
                    lang === 'en' ? 'Factory Reset Database?' : 'ডাটাবেজ ফ্যাক্টরি রিসেট করবেন?',
                    lang === 'en' 
                      ? 'This will wipe out all custom products, orders, and users, restoring the default catalog.' 
                      : 'এটি আপনার সকল কাস্টম পণ্য, অর্ডার ও রেজিস্টার্ড ইউজার মুছে দিয়ে ডিফল্ট স্টোর ডাটাবেজে ফিরিয়ে নিয়ে যাবে।',
                    () => {
                      localStorage.removeItem('anono_products');
                      localStorage.removeItem('anono_orders');
                      localStorage.removeItem('anono_users');
                      localStorage.removeItem('anono_banners');
                      showAlert(
                        lang === 'en' ? 'Database Reset' : 'ডাটাবেজ রি-ইনস্টল সম্পন্ন',
                        lang === 'en' ? 'Database restored to seed defaults. Refreshing app now.' : 'ডাটাবেজ সফলভাবে রিফ্রেস করা হয়েছে। পেজ রিলোড হচ্ছে...',
                        'success'
                      );
                      setTimeout(() => {
                        window.location.reload();
                      }, 1200);
                    },
                    true
                  );
                }}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span>{lang === 'en' ? 'Wipe & Seed Defaults' : 'ডাটাবেজ ফ্যাক্টরি রিসেট'}</span>
              </button>
            </div>

            {/* Storage Metric Blocks */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-neutral-100 shadow-3xs text-left">
                <span className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">📦 Products Table</span>
                <p className="text-lg font-extrabold text-neutral-800 mt-1">{products.length} <span className="text-xs text-neutral-400 font-bold">rows</span></p>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-neutral-100 shadow-3xs text-left">
                <span className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">🛍️ Client Orders</span>
                <p className="text-lg font-extrabold text-neutral-800 mt-1">{orders.length} <span className="text-xs text-neutral-400 font-bold">rows</span></p>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-neutral-100 shadow-3xs text-left">
                <span className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">👥 Client registry</span>
                <p className="text-lg font-extrabold text-neutral-800 mt-1">{users.length} <span className="text-xs text-neutral-400 font-bold">rows</span></p>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-neutral-100 shadow-3xs text-left">
                <span className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">💾 Storage Quota</span>
                <p className="text-lg font-extrabold text-indigo-600 mt-1">~{Math.round((JSON.stringify(products).length + JSON.stringify(orders).length + JSON.stringify(users).length) / 1024)} <span className="text-xs text-neutral-400 font-bold">KB (LocalStorage)</span></p>
              </div>
            </div>

            {/* Core Section: JSON Editor on Left, Elasticsearch simulation on right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Database JSON Reader/Writer Editor */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <span>{lang === 'en' ? 'Live NoSQL Table Inspector' : 'লাইভ NoSQL এডিটর'}</span>
                  </h3>
                  
                  {/* Table Selection Dropdowns */}
                  <div className="flex gap-1">
                    {(['products', 'orders', 'users', 'banners'] as const).map((tbl) => (
                      <button
                        key={tbl}
                        onClick={() => setDbSelectedTable(tbl)}
                        className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all capitalize border cursor-pointer ${
                          dbSelectedTable === tbl 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {tbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-neutral-600">
                      {lang === 'en' ? `File: tbl_${dbSelectedTable}.json` : `ফাইল/টেবিল: tbl_${dbSelectedTable}.json`}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md animate-pulse">
                      ● Active Live Synchronized
                    </span>
                  </div>
                  <textarea
                    value={dbEditedJsonText}
                    onChange={(e) => setDbEditedJsonText(e.target.value)}
                    rows={12}
                    className="w-full bg-neutral-900 text-emerald-400 font-mono text-[11px] p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 overflow-y-auto"
                    spellCheck="false"
                  />
                </div>

                {/* Database Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(dbEditedJsonText);
                        if (!Array.isArray(parsed)) {
                          throw new Error('Database schema values must be encapsulated as a top-level Array list.');
                        }
                        
                        showConfirm(
                          lang === 'en' ? 'Confirm Database Write?' : 'ডাটাবেজে পরিবর্তন লিখতে চান?',
                          lang === 'en' 
                            ? 'This raw JSON write immediately overrides local state entries dynamically. Incorrect schemas could break components!'
                            : 'এই র-JSON পরিবর্তনটি লাইভ ডাটাবেজ টেবিল ওভাররাইড করবে। ফরম্যাট সঠিক না হলে অ্যাপ ক্র্যাশ হতে পারে!',
                          () => {
                            if (dbSelectedTable === 'products') {
                              if (onUpdateProducts) onUpdateProducts(parsed);
                              localStorage.setItem('anono_products', JSON.stringify(parsed));
                            } else if (dbSelectedTable === 'orders') {
                              if (onUpdateOrders) onUpdateOrders(parsed);
                              localStorage.setItem('anono_orders', JSON.stringify(parsed));
                            } else if (dbSelectedTable === 'users') {
                              if (onUpdateUsers) onUpdateUsers(parsed);
                              localStorage.setItem('anono_users', JSON.stringify(parsed));
                            } else if (dbSelectedTable === 'banners') {
                              if (onUpdateBanners) onUpdateBanners(parsed);
                              localStorage.setItem('anono_banners', JSON.stringify(parsed));
                            }
                            
                            showAlert(
                              lang === 'en' ? 'Database Write Successful' : 'ডাটাবেজ আপডেট সম্পন্ন',
                              lang === 'en' ? 'Live localStorage data overriden seamlessly!' : 'নির্বাচিত ডাটাবেজ টেবিল সফলভাবে আপডেট করা হয়েছে।',
                              'success'
                            );
                          },
                          true
                        );
                      } catch (err: any) {
                        showAlert(
                          lang === 'en' ? 'JSON Validation Failed' : 'ভুল JSON এন্ট্রি',
                          lang === 'en' ? `Error: ${err.message}` : `ভুল ফরম্যাট: ${err.message}. ব্র্যাকেট বা কমা চেক করুন।`,
                          'error'
                        );
                      }
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer text-center"
                  >
                    {lang === 'en' ? 'Save Table Changes (Write DB)' : 'টেবিল ডাটা সরাসরি সেভ করুন'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      let rawText = '';
                      if (dbSelectedTable === 'products') rawText = JSON.stringify(products, null, 2);
                      else if (dbSelectedTable === 'orders') rawText = JSON.stringify(orders, null, 2);
                      else if (dbSelectedTable === 'users') rawText = JSON.stringify(users, null, 2);
                      else if (dbSelectedTable === 'banners') rawText = JSON.stringify(banners, null, 2);
                      setDbEditedJsonText(rawText);
                      showAlert(
                        lang === 'en' ? 'Changes Discarded' : 'বাতিল করা হয়েছে',
                        lang === 'en' ? 'Database editor restored to current state.' : 'ডাটাবেজ এডিটরের লেখাগুলো পূর্বাবস্থায় ফিরিয়ে আনা হয়েছে।',
                        'info'
                      );
                    }}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    {lang === 'en' ? 'Discard' : 'বাতিল'}
                  </button>
                </div>
              </div>

              {/* Right Column: Elasticsearch Live Search Indexing Simulation */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-2xs space-y-4">
                <div className="border-b pb-3 flex items-center justify-between">
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-purple-600" />
                    <span>{lang === 'en' ? 'Elasticsearch Live Scoring & Index Log' : 'দারাজ-স্টাইল ইলাস্টিকসার্চ ইনডেক্স'}</span>
                  </h3>
                  <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-black">
                    NLP & RELEVANCE
                  </span>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 text-[11px] leading-relaxed text-neutral-600 space-y-2 text-left">
                  <p className="font-extrabold text-neutral-800 flex items-center gap-1">
                    <span>💡</span>
                    <span>{lang === 'en' ? 'How Search engine logic processes products:' : 'দারাজ-সার্চ ইঞ্জিন ডেমো কীভাবে কাজ করে:'}</span>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 font-semibold text-neutral-500">
                    <li><strong className="text-neutral-700">Tokenization & NLP:</strong> Names are split into individual parts, and matching is cross-lingual (English matches Bangla & vice-versa).</li>
                    <li><strong className="text-neutral-700">Text Match & Relevance weight (সার্চ স্কোরিং):</strong> Points are assigned depending on where matching tokens are (Name = 100pts, Category = 40pts, Description = 10pts).</li>
                    <li><strong className="text-neutral-700">Ranking modifiers:</strong> Products with higher reviewscount and higher ratings score higher, and out of stock entries are pushed down!</li>
                  </ul>
                </div>

                {/* Live simulated Elasticsearch Index lists */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-neutral-700 text-left">
                    {lang === 'en' ? 'Live Inverted-Index Table & Relevance Weights:' : 'লাইভ ইনভার্টেড সার্চ ইনডেক্সিং ম্যাপিং টেবল:'}
                  </h4>

                  <div className="max-h-[240px] overflow-y-auto border border-neutral-100 rounded-xl divide-y divide-neutral-100 bg-neutral-50/20">
                    {products.slice(0, 8).map((p) => {
                      // Tokenize title
                      const tokens = (p.name || '').toLowerCase()
                        .replace(/[^a-zA-Z0-9\s‌িাোুেি]/g, '')
                        .split(/\s+/)
                        .filter(t => t.length > 1);
                      const staticWeight = Math.round((p.rating * 15) + (p.reviewsCount * 0.2));
                      
                      return (
                        <div key={p.id} className="p-3 text-left flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-neutral-805 text-neutral-800 truncate block max-w-[170px]">{p.name}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                p.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                              }`}>
                                {p.stock > 0 ? 'In Stock (স্টকে)' : 'Out of stock'}
                              </span>
                            </div>
                            {/* Tokens display */}
                            <div className="flex flex-wrap gap-1">
                              {tokens.map((tok, ti) => (
                                <span key={ti} className="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-1 py-0.2 rounded border border-neutral-200">
                                  {tok}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Calculated Static relevance ranking score */}
                          <div className="text-right shrink-0 space-y-0.5">
                            <span className="text-[10px] text-neutral-400 font-bold block">Relevance Score</span>
                            <span className="font-mono font-black text-purple-600 text-xs">{staticWeight} pts</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ===================== VIEW - CUSTOMER SUPPORT TICKETS MANAGEMENT ===================== */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-neutral-800">
                {lang === 'en' ? 'Customer Support Center Tickets Desk' : 'গ্রাহক সহায়তা টিকিট ও কমপ্লেইন পোর্টাল'}
              </h2>
              <p className="text-xs text-neutral-400">
                {lang === 'en' 
                  ? 'Review user-facing support tickets, change status, and submit direct customer agent feedback responses.'
                  : 'গ্রাহকদের জমা দেওয়া সাধারণ ও জরুরি অভিযোগ টিকিট পর্যবেক্ষণ করুন, ডাইরেক্ট টিম রিপ্লাই পাঠান এবং অবস্থান আপডেট করুন।'}
              </p>
            </div>

            {(() => {
              const filteredTickets = adminTickets.filter(t => {
                if (ticketFilter === 'open') return t.status === TicketStatus.OPEN;
                if (ticketFilter === 'resolved') return t.status === TicketStatus.RESOLVED;
                return true;
              });

              // Calculated Indicators
              const totalTickCount = adminTickets.length;
              const pendingTickCount = adminTickets.filter(t => t.status === TicketStatus.OPEN).length;
              const completedTickCount = adminTickets.filter(t => t.status === TicketStatus.RESOLVED).length;

              return (
                <div className="space-y-6">
                  {/* Indicators Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-neutral-150/70 shadow-3xs flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm select-none">
                        🎟️
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider block">Total Tickets</span>
                        <span className="font-mono text-base font-black text-neutral-850">{totalTickCount}</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-neutral-150/70 shadow-3xs flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center font-bold text-yellow-700 text-sm select-none">
                        ⏳
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider block">Pending Open</span>
                        <span className="font-mono text-base font-black text-yellow-750">{pendingTickCount}</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-neutral-150/70 shadow-3xs flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center font-bold text-green-700 text-sm select-none">
                        ✅
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider block">Resolved Done</span>
                        <span className="font-mono text-base font-black text-green-750">{completedTickCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Filter Menu Options */}
                  <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                    {[
                      { key: 'all', label: lang === 'en' ? 'All Support Tickets' : 'সব কমপ্লেইন টিকিট' },
                      { key: 'open', label: lang === 'en' ? 'Open & Active' : 'পেন্ডিং / একটিভ' },
                      { key: 'resolved', label: lang === 'en' ? 'Resolved / Closed' : 'সমাধানকৃত' }
                    ].map(fOpt => (
                      <button
                        key={fOpt.key}
                        type="button"
                        onClick={() => setTicketFilter(fOpt.key as any)}
                        className={`text-[10.5px] font-extrabold px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                          ticketFilter === fOpt.key 
                            ? 'bg-indigo-600 text-white shadow-xs' 
                            : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        {fOpt.label}
                      </button>
                    ))}
                  </div>

                  {/* Tickets detailed item list */}
                  <div className="space-y-4">
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((t) => (
                        <div key={t.id} className="bg-white p-5 rounded-3xl border border-neutral-200/60 shadow-xs space-y-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-50 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-neutral-100 text-indigo-700 font-mono text-[10px] font-black px-2.5 py-1 rounded-md border border-neutral-200">
                                {t.id}
                              </span>
                              <span className="bg-purple-100 text-purple-700 font-mono text-[10px] font-black px-2 py-0.5 rounded">
                                {t.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-neutral-450 font-bold">
                                {new Date(t.createdAt).toLocaleString()}
                              </span>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                t.status === TicketStatus.OPEN 
                                  ? 'bg-yellow-100 text-yellow-750' 
                                  : 'bg-green-100 text-green-750'
                              }`}>
                                {t.status === TicketStatus.OPEN ? 'Pending / Click to Resolve' : 'RESOLVED'}
                              </span>
                            </div>
                          </div>

                          {/* Client Sender Details bar */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px] bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                            <div>
                              <span className="text-neutral-400 block font-bold">Sender Name</span>
                              <span className="font-bold text-neutral-700">{t.name}</span>
                            </div>
                            <div>
                              <span className="text-neutral-400 block font-bold">Sender Email</span>
                              <span className="font-bold text-neutral-700">{t.email}</span>
                            </div>
                            <div>
                              <span className="text-neutral-400 block font-bold">Sender Mobile</span>
                              <span className="font-bold text-neutral-700">{t.phone || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-neutral-400 block font-bold">User System ID</span>
                              <span className="font-mono font-bold text-neutral-500">{t.userId}</span>
                            </div>
                          </div>

                          {/* Subject and original message content */}
                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-neutral-800 uppercase tracking-tight">
                              📄 {t.subject}
                            </h4>
                            <p className="text-xs font-semibold text-neutral-600 leading-relaxed pl-4 border-l-2 border-indigo-200">
                              {t.message}
                            </p>
                          </div>

                          {/* Response state feedback */}
                          {t.response ? (
                            <div className="p-3 bg-emerald-50/50 border border-emerald-150 rounded-2xl text-xs space-y-1">
                              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                                Direct Client Response Feed:
                              </span>
                              <p className="font-bold text-neutral-700 italic">
                                "{t.response}"
                              </p>
                            </div>
                          ) : (
                            <div className="text-[10px] font-black text-yellow-800 bg-yellow-50/50 p-2 rounded-xl border border-yellow-150 max-w-max">
                              ⚠️ No official team reply sent to client yet.
                            </div>
                          )}

                          {/* Actions: Send Reply and Update Status */}
                          <div className="pt-2 border-t border-neutral-50 space-y-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">
                                Send / Update Support Response Message
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Type your official reply (e.g., We checked your transaction. Order is confirmed or Refund is initiated.)"
                                  value={replyText[t.id] !== undefined ? replyText[t.id] : (t.response || '')}
                                  onChange={(e) => setReplyText({ ...replyText, [t.id]: e.target.value })}
                                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-1.5 text-xs text-neutral-750 focus:outline-none focus:border-indigo-500 font-semibold"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const reply = replyText[t.id] !== undefined ? replyText[t.id] : (t.response || '');
                                    handleUpdateTicket(t.id, t.status, reply);
                                    alert(lang === 'en' ? 'User response saved successfully!' : 'গ্রাহক রিপ্লাই সফলভাবে সংরক্ষণ করা হয়েছে!');
                                  }}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10.5px] px-4 rounded-xl transition-all h-8.5 shrink-0 cursor-pointer"
                                >
                                  {lang === 'en' ? 'Save Reply' : 'রিপ্লাই সংরক্ষণ করুন'}
                                </button>
                              </div>
                            </div>

                            {/* Status change actions */}
                            <div className="flex items-center gap-2">
                              {t.status === TicketStatus.OPEN ? (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateTicket(t.id, TicketStatus.RESOLVED)}
                                  className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-[10.5px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-3xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{lang === 'en' ? 'Mark Resolved (Closed)' : 'সমাধান হিসাবে বন্ধ করুন (Resolved)'}</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateTicket(t.id, TicketStatus.OPEN)}
                                  className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-extrabold text-[10.5px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <span>🔓</span>
                                  <span>{lang === 'en' ? 'Re-open Ticket' : 'পুনরায় ওপেন করুন'}</span>
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white rounded-3xl border border-neutral-150 text-neutral-400 font-bold italic">
                        {lang === 'en' ? 'No tickets found matching this filter.' : 'ফিল্টারের সাথে মিলে যায় এমন কোনো কাস্টমার অভিযোগ বা টিকিট পাওয়া যায়নি।'}
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* CREATE/EDIT PRODUCT DIALOG MODAL */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsProductModalOpen(false)}
                className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
              />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-6 md:p-8"
              >
                {/* Modal Title */}
                <h3 className="text-md font-bold text-neutral-800 border-b pb-3 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-600" />
                  <span>{editingProduct ? 'পণ্যের বিবরণ আপডেট' : 'নতুন পণ্য যুক্ত করুন'}</span>
                </h3>

                <form onSubmit={handleSubmitProduct} className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">পণ্যের নাম (Product Name)</label>
                    <input
                      type="text"
                      required
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      placeholder="উদাঃ High Bass Bluetooth Headset"
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Grid for prices and stock */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600">বিক্রয় মূল্য (Price ৳)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={pPrice}
                        onChange={(e) => setPPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600">আসল মূল্য / এমআরপি (Original ৳)</label>
                      <input
                        type="number"
                        min={1}
                        value={pOriginalPrice}
                        onChange={(e) => setPOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Category and Stock */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600">ক্যাটাগরি (Category)</label>
                      <input
                        type="text"
                        list="admin-categories-datalist"
                        value={pCategory}
                        onChange={(e) => {
                          setPCategory(e.target.value);
                        }}
                        placeholder={lang === 'en' ? "Type or select category" : "ক্যাটাগরি লিখুন বা সিলেক্ট করুন"}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-750 focus:outline-none focus:border-indigo-500 font-bold shadow-2xs"
                      />
                      <datalist id="admin-categories-datalist">
                        {adminCategorySuggestions.map((cat, idx) => (
                          <option key={idx} value={cat} />
                        ))}
                      </datalist>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600">নতুন স্টক পরিমাণ (Stk. Qty)</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={pStock}
                        onChange={(e) => setPStock(Number(e.target.value))}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Multi-level nestable Category details (Always visible so they can type custom suggestions) */}
                  <div className="grid grid-cols-2 gap-3 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-indigo-700 flex items-center gap-1 uppercase tracking-wide">
                        <span>📂</span>
                        <span>উপ-ক্যাটাগরি (Subcategory)</span>
                      </label>
                      <input
                        type="text"
                        list="admin-subcategories-datalist"
                        value={pSubcategory}
                        onChange={(e) => {
                          setPSubcategory(e.target.value);
                        }}
                        placeholder={lang === 'en' ? "Type or select sub" : "সাব-ক্যাটাগরি লিখুন বা সিলেক্ট করুন"}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-2 py-1.5 text-xs text-neutral-750 focus:outline-none focus:border-indigo-500 font-semibold"
                      />
                      <datalist id="admin-subcategories-datalist">
                        {adminSubcategorySuggestions.map((sub, idx) => (
                          <option key={idx} value={sub} />
                        ))}
                      </datalist>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-indigo-700 flex items-center gap-1 uppercase tracking-wide">
                        <span>🏷️</span>
                        <span>উপ-উপক্যাটাগরি (Sub-Sub)</span>
                      </label>
                      <input
                        type="text"
                        list="admin-subsubcategories-datalist"
                        value={pSubSubcategory}
                        onChange={(e) => setPSubSubcategory(e.target.value)}
                        placeholder={lang === 'en' ? "Type or select sub-sub" : "উপ-উপক্যাটাগরি লিখুন বা সিলেক্ট করুন"}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-2 py-1.5 text-xs text-neutral-750 focus:outline-none focus:border-indigo-500 font-semibold"
                      />
                      <datalist id="admin-subsubcategories-datalist">
                        {adminSubSubcategorySuggestions.map((ss, idx) => (
                          <option key={idx} value={ss} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Unified 6-Slot Gallery Image Manager */}
                  <div className="space-y-3 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-200/60 shadow-inner">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-neutral-750 flex items-center gap-1.5">
                        <Image className="w-4 h-4 text-purple-600 animate-pulse" />
                        {lang === 'en' ? 'Product Image Manager (Max 6 Multi-Angle Photos)' : 'প্রোডাক্ট গ্যালারি ইমেজ ম্যানেজার (সর্বোচ্চ ৬ টি ছবি)'}
                      </span>
                      <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                        {lang === 'en' 
                          ? 'Select any slot below to assign or upload a custom image. First slot is the primary search cover.' 
                          : 'যেকোনো স্লটে ক্লিক করে ছবি আপলোড করুন বা লিংক দিন। ১ নম্বর ছবিটি প্রধান কভার বা মূল প্রোডাক্ট ইমেজ হিসেবে ব্যবহৃত হবে।'}
                      </p>
                    </div>

                    {/* The 6 Slots grid list */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[0, 1, 2, 3, 4, 5].map((idx) => {
                        const imgUrl = pSlotImages[idx];
                        const isActive = pActiveSlot === idx;
                        return (
                          <div
                            key={idx}
                            type="button"
                            onClick={() => setPActiveSlot(idx)}
                            className={`relative border rounded-xl p-1 bg-white cursor-pointer transition-all flex flex-col items-center justify-between text-center select-none aspect-square group ${
                              isActive 
                                ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-md scale-[1.02]' 
                                : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            {/* Slot header label */}
                            <span className={`text-[8.5px] font-black tracking-tighter block mb-0.5 ${idx === 0 ? 'text-indigo-600' : 'text-neutral-400'}`}>
                              {idx === 0 ? (lang === 'en' ? 'Cover' : '১ম (মূল)') : `${idx + 1}`}
                            </span>

                            {/* Center Preview or Placeholder */}
                            <div className="w-full flex-1 flex items-center justify-center overflow-hidden rounded-lg bg-neutral-50 border border-neutral-150 relative">
                              {imgUrl ? (
                                <img
                                  src={imgUrl}
                                  alt=""
                                  className="max-h-full max-w-full object-contain"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&auto=format&fit=crop&q=80';
                                  }}
                                />
                              ) : (
                                <span className="text-[12px] text-neutral-300 font-extrabold">+</span>
                              )}
                            </div>

                            {/* Clean button overlay */}
                            {idx > 0 && imgUrl && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSlotImageChange(idx, '');
                                }}
                                className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shadow-xs transition-colors cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Configurations details of active slots */}
                    <div className="bg-white p-3 rounded-xl border border-neutral-200/60 shadow-3xs space-y-3.5 text-left transition-all">
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                          <span className="text-indigo-600 animate-ping">●</span>
                          <span>
                            {lang === 'en' ? `Configuring Image Slot ${pActiveSlot + 1}` : `নির্দিষ্ট ছবি স্লট ${pActiveSlot + 1} কনফিগারেশন`}
                          </span>
                        </span>
                        {pActiveSlot === 0 ? (
                          <span className="text-[8.5px] font-bold text-indigo-605 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">
                            {lang === 'en' ? 'Cover Image (Required)' : 'মূল কাভার ছবি (বাধ্যতামূলক)'}
                          </span>
                        ) : (
                          <span className="text-[8.5px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                            {lang === 'en' ? `Multi-angle Gallery ${pActiveSlot}` : `অতিরিক্ত গ্যালারি ছবি ${pActiveSlot}`}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* File upload section */}
                        <div className="flex flex-col justify-center">
                          <label 
                            className="border-2 border-dashed border-neutral-200 hover:border-indigo-500 rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/10 transition-all text-center group h-24"
                          >
                            <input
                              type="file"
                              key={`slot-file-${pActiveSlot}`}
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleSlotImageFileUpload(pActiveSlot, e.target.files[0]);
                                  e.target.value = ''; // Reset uploader state
                                }
                              }}
                            />
                            <Upload className="w-5 h-5 text-neutral-400 mb-1 group-hover:text-indigo-600 group-hover:scale-110 transition-all" />
                            <span className="text-[10px] font-bold text-neutral-600 group-hover:text-indigo-600">
                              {lang === 'en' ? 'Upload Image File' : 'ডিভাইস থেকে ছবি আপলোড'}
                            </span>
                            <span className="text-[8px] text-neutral-400 mt-0.5">
                              {lang === 'en' ? 'Supports JPEG, PNG (We auto-compress size)' : 'জেপিজি, পিএনজি (অটো কম্প্রেসড)'}
                            </span>
                          </label>
                        </div>

                        {/* URL Paste section */}
                        <div className="space-y-1.5 flex flex-col justify-between">
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold text-neutral-500 uppercase tracking-widest block">
                              {lang === 'en' ? 'Or Paste Image Web Link' : 'অথবা ওয়েব জুম-লিংক (পিকচার ইউআরএল)'}
                            </label>
                            <input
                              type="text"
                              value={pSlotImages[pActiveSlot] || ''}
                              onChange={(e) => handleSlotImageChange(pActiveSlot, e.target.value)}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-750 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                            />
                          </div>

                          {/* Quick testing Unsplash cover presets */}
                          <div className="flex flex-wrap gap-1 items-center select-none">
                            <span className="text-[8px] text-neutral-400 font-extrabold uppercase tracking-wide">Presets:</span>
                            {[
                              { name: 'Red Shoe', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
                              { name: 'Buds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80' },
                              { name: 'Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' },
                              { name: 'Shirt', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80' },
                              { name: 'Home', url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80' }
                            ].map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSlotImageChange(pActiveSlot, preset.url)}
                                className="bg-neutral-50 hover:bg-neutral-100 border text-[8.5px] px-1.5 py-0.5 rounded cursor-pointer text-neutral-600 font-semibold whitespace-nowrap"
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Direct Copy Paste Grid for all 6 Slots (Foolproof alternative uploader) */}
                    <div className="bg-white p-3.5 rounded-xl border border-neutral-200/60 shadow-3xs space-y-2 mt-2">
                       <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider block">
                         {lang === 'en' ? 'Direct Image Links (All 6 Slots)' : 'একসাথে সবগুলো স্লটের লিংক যোগ করুন (৬ টি ছবি)'}
                       </span>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                         {[0, 1, 2, 3, 4, 5].map((idx) => (
                           <div key={idx} className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1.5 rounded-lg border border-neutral-150 relative group">
                             <span className={`text-[8.5px] font-black w-14 flex-shrink-0 ${idx === 0 ? 'text-indigo-600' : 'text-neutral-450'}`}>
                               {idx === 0 ? (lang === 'en' ? 'Main/Cover' : '১ম কাভার') : `${lang === 'en' ? 'Slot' : 'ছবি'} ${idx + 1}`}
                             </span>
                             <input 
                               type="text"
                               placeholder="https://images.unsplash.com/..."
                               value={pSlotImages[idx] || ''}
                               onChange={(e) => handleSlotImageChange(idx, e.target.value)}
                               className="w-full bg-transparent text-[10px] leading-none text-neutral-700 outline-none font-mono py-0.5 border-b border-transparent focus:border-indigo-500"
                             />
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">পণ্যের বিবরণ (Description)</label>
                    <textarea
                      required
                      value={pDescription}
                      onChange={(e) => setPDescription(e.target.value)}
                      placeholder="পণ্য সম্পর্কে বিস্তারিত তথ্য যেমন সাইজ, কালার, ওয়ারেন্টি..."
                      rows={3}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Is Featured Checkbox */}
                  <div className="flex items-center gap-2 py-1.5">
                    <input
                      type="checkbox"
                      id="isFeat"
                      checked={pIsFeatured}
                      onChange={(e) => setPIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-neutral-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="isFeat" className="text-xs font-bold text-neutral-700 cursor-pointer user-select-none">
                      হট ডিল বা আকর্ষণীয় পণ্যে (Featured Product) তালিকাভুক্ত করুন
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="w-1/3 bg-neutral-100 text-neutral-700 border border-neutral-200 font-bold py-2.5 rounded-xl hover:bg-neutral-200 cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 shadow-md transition-colors cursor-pointer"
                    >
                      {editingProduct ? 'বিবরণ আপডেট করুন' : 'নতুন পণ্যটি যুক্ত করুন'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}

        {/* ===================== CUSTOM CONFIRMATION DIALOG ===================== */}
        {customConfirm && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-neutral-100 shadow-2xl p-6 w-full max-w-md text-center space-y-4"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                customConfirm.isDanger ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
              }`}>
                {customConfirm.isDanger ? <AlertTriangle className="w-6 h-6" /> : <Package className="w-6 h-6" />}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-md font-extrabold text-neutral-800">{customConfirm.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed px-2">{customConfirm.description}</p>
              </div>

              <div className="flex gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCustomConfirm(null)}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-2.5 rounded-xl cursor-pointer transition-colors"
                >
                  {customConfirm.cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => customConfirm.onConfirm()}
                  className={`flex-1 text-white font-bold py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm ${
                    customConfirm.isDanger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {customConfirm.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ===================== CUSTOM ALERT DIALOG ===================== */}
        {customAlert && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-neutral-100 shadow-2xl p-6 w-full max-w-sm text-center space-y-4"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                customAlert.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                {customAlert.type === 'error' ? <Ban className="w-6 h-6" /> : <Check className="w-6 h-6" />}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-md font-extrabold text-neutral-800">{customAlert.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed px-2">{customAlert.description}</p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCustomAlert(null)}
                  className="w-full bg-neutral-800 hover:bg-neutral-900 text-white font-bold py-2.5 rounded-xl cursor-pointer transition-colors text-xs"
                >
                  {lang === 'en' ? 'Okay' : 'ঠিক আছে'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
