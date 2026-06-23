export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked'
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured?: boolean;
  subcategory?: string;
  subSubcategory?: string;
  images?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Cash on Delivery';
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  phone?: string;
  password?: string;
}

export interface BannerSlide {
  id: string;
  badge: { bn: string; en: string };
  title: { bn: string; en: string };
  line1?: { bn: string; en: string };
  line2?: { bn: string; en: string };
  subtitle: { bn: string; en: string };
  content: { bn: string; en: string };
  actionText?: { bn: string; en: string };
  discountText: { bn: string; en: string };
  discountBg: string;
  textColor: string;
  badgeType: string;
  bgPresetClass: string;
  category: string;
  searchQuery?: string;
  imageUrl: string;
  isFullImage?: boolean;
}

export enum TicketStatus {
  OPEN = 'Open',
  RESOLVED = 'Resolved'
}

export interface SupportTicket {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  screenshot?: string;
  response?: string;
  status: TicketStatus;
  createdAt: string;
  category: 'Order & Delivery' | 'Return & Refund' | 'Payment' | 'Account' | 'Other';
}

