import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  HelpCircle, 
  Send, 
  MessageSquare, 
  Tag, 
  Calendar, 
  PlusCircle, 
  CheckCircle, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  ArrowRight, 
  Package, 
  ShieldAlert, 
  LifeBuoy,
  FileText,
  ChevronDown,
  ChevronUp,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { SupportTicket, TicketStatus, Order, OrderStatus } from '../types';

interface SupportCenterProps {
  lang: 'en' | 'bn';
  orders: Order[];
  currentUser: { id: string; name: string; email: string; phone?: string } | null;
}

interface FAQItem {
  id: string;
  category: 'delivery' | 'refund' | 'payment' | 'account';
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'f1',
    category: 'delivery',
    questionEn: 'How can I track my order?',
    questionBn: 'আমি কীভাবে আমার অর্ডার ট্রাক করতে পারি?',
    answerEn: 'You can easily track your order using our Track Your Order section. Just enter your 8-digit Order ID (e.g. ANO-7821) inside the support center chat or main navbar tracker to see real-time shipping status.',
    answerBn: 'আমাদের "অর্ডার ট্র্যাক" সেকশন ব্যবহার করে সহজে অর্ডার ট্র্যাক করতে পারেন। আপনার ৮ সংখ্যার অর্ডার আইডি (যেমন: ANO-7821) চ্যাটবটে লিখুন বা মূল নেভিগেশন বারের অর্ডার ট্র্যাকার ব্যবহার করে লাইভ ডেলিভারি স্ট্যাটাস দেখুন।'
  },
  {
    id: 'f2',
    category: 'delivery',
    questionEn: 'How long does delivery take and what is the fee?',
    questionBn: 'ডেলিভারি পেতে কতদিন সময় লাগবে এবং ডেলিভারি চার্জ কত?',
    answerEn: 'Inside Dhaka delivery takes 24-48 hours. Outside Dhaka takes 3-4 days. Standard delivery charge is 60 Taka, but we offer completely Free Shipping on orders above 1,500 Taka!',
    answerBn: 'ঢাকা সিটির ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি দেওয়া হয়। ঢাকার বাইরে ৩ থেকে ৪ দিন সময় লাগতে পারে। নিয়মিত ডেলিভারি চার্জ ৬০ টাকা, কিন্তু ১,৫০০ টাকার বেশি অর্ডারে আমরা সম্পূর্ণ ফ্রি ডেলিভারি প্রদান করি!'
  },
  {
    id: 'f3',
    category: 'refund',
    questionEn: 'What is the return policy?',
    questionBn: 'পণ্য ফেরত দেওয়ার নীতি বা রিটার্ন পলিসি কী?',
    answerEn: 'If a product is damaged, deficient, or different from description, you can return it within 7 days of delivery. Keep original packaging and tags intact. Refunds are initiated instantly once returns are checked.',
    answerBn: 'যদি কোনো প্রোডাক্ট ডিফেক্টিভ, ভাঙা বা বিবরণের সাথে অমিল থাকে, তবে পণ্য পাওয়ার ৭ দিনের মধ্যে তা ফেরত দিতে পারবেন। মনে রাখবেন, পণ্যের বক্স ও ট্যাগ অক্ষত থাকতে হবে। প্রোডাক্ট ফেরত আসার পর দ্রুত রিফান্ড করা হবে।'
  },
  {
    id: 'f4',
    category: 'refund',
    questionEn: 'How do I receive my refund?',
    questionBn: 'আমি কীভাবে রিফান্ডের টাকা ফেরত পাবো?',
    answerEn: 'Refunds are credited through the same payment method used during order completion. bKash/Nagad transfers take 24-48 hours. For Cash on Delivery, we will contact you to send funds via Bkash/Nagad.',
    answerBn: 'পেমেন্ট করার সময় যে মাধ্যম ব্যবহার করেছেন, সেই অ্যাকাউন্টেই টাকা ফেরত পাঠানো হবে। বিকাশ/নগদের মাধ্যমে রিফান্ড আসতে ২৪-৪৮ ঘণ্টা লাগে। ক্যাশ অন ডেলিভারির ক্ষেত্রে আমরা আপনার সাথে যোগাযোগ করে বিকাশ/নগদে টাকা পাঠাবো।'
  },
  {
    id: 'f5',
    category: 'payment',
    questionEn: 'What payment methods do you accept?',
    questionBn: 'এখানে পেমেন্ট করার কী কী মাধ্যম রয়েছে?',
    answerEn: 'We accept Cash on Delivery (COD) across Bangladesh, secure bKash transfers, Nagad payments, and SSLCommerz secured cards if available.',
    answerBn: 'আমরা সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারি (COD), নিরাপদ বিকাশ পেমেন্ট ও নগদ ওয়ালেট পেমেন্ট গ্রহণ করি।'
  },
  {
    id: 'f6',
    category: 'payment',
    questionEn: 'What should I do if my payment failed but money was deducted?',
    questionBn: 'যদি পেমেন্ট ফেইল হয় কিন্তু ব্যালেন্স কেটে নেওয়া হয়, সেক্ষেত্রে করণীয় কী?',
    answerEn: 'Do not worry! If an order fails but money gets deducted from bKash/Nagad, our auto-reconciliation will instantly notice it and reverse the charge or confirm your order manually. Please submit a support ticket below or call us immediately.',
    answerBn: 'চিন্তা করবেন না! যদি পেমেন্ট ফেইল হয় এবং আপনার বিকাশ/নগদ থেকে টাকা কেটে নেওয়া হয়, তবে আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে সেটি ২৪ ঘণ্টার মধ্যে রিভার্স বা অর্ডার কনফার্ম করে দেবে। আপনি নিচে একটি সাপোর্ট টিকিট খুলতে পারেন।'
  },
  {
    id: 'f7',
    category: 'account',
    questionEn: 'How do I change my password or account credentials?',
    questionBn: 'আমার পাসওয়ার্ড বা অ্যাকাউন্টের তথ্য কীভাবে পরিবর্তন করব?',
    answerEn: 'Go to your account profile module in Settings/Dashboard to update your phone number, shipping address, or system password securely at any time.',
    answerBn: 'সেটিংস/ড্যাশবোর্ডের ভেতরে প্রোফাইল মডিউলে গিয়ে যেকোনো সময় আপনার মোবাইল নাম্বার, ঠিকানা এবং পাসওয়ার্ড আপডেট বা পরিবর্তন করতে পারেন।'
  }
];

export default function SupportCenter({ lang, orders, currentUser }: SupportCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'delivery' | 'refund' | 'payment' | 'account'>('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Tickets state loaded from LocalStorage
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('anono_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    const defaultTickets: SupportTicket[] = [
      {
        id: 'TCK-294028',
        userId: 'u2',
        name: 'Rahat Islam',
        email: 'rahat@gmail.com',
        phone: '01712345678',
        category: 'Order & Delivery',
        subject: 'ডেলিভারি কবে পাবো?',
        message: 'ANO-7821 এই মেগা ক্যাম্পেইনের ইয়ারবাডস অর্ডারটি কি আগামীকালের মধ্যে শিপিং করা সম্ভব? দয়া করে জানাবেন।',
        response: 'আসসালামু আলাইকুম রাহাত ভাই! আপনার অর্ডারটি ইতোমধ্যেই কুরিয়ারে হস্তান্তর করা হয়েছে, আশা করি আগামীকাল বিকালের মধ্যে পেয়ে যাবেন। ধন্যবাদ!',
        status: TicketStatus.RESOLVED,
        createdAt: '2026-06-14T08:00:00Z'
      },
      {
        id: 'TCK-892104',
        userId: 'guest',
        name: 'Mim Akter',
        email: 'mim@outlook.com',
        phone: '01899988877',
        category: 'Payment',
        subject: 'বিকাশ পেমেন্ট কেটেছে কিন্তু পেন্ডিং দেখাচ্ছে',
        message: 'আমি একটু আগে আমার বিকাশ ওয়ালেট থেকে ৫৫০ টাকা পেমেন্ট করেছি। কিন্তু আমার কাছে কোনো মেসেজ আসল না কেন? আমার অর্ডার আইডি হচ্ছে ANO-9204। একটু চেক করুন।',
        status: TicketStatus.OPEN,
        createdAt: '2526-06-16T12:00:00Z'
      }
    ];
    localStorage.setItem('anono_tickets', JSON.stringify(defaultTickets));
    return defaultTickets;
  });

  // Save tickets to localStorage
  useEffect(() => {
    localStorage.setItem('anono_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Form states for new Ticket submission
  const [tName, setTName] = useState(currentUser?.name || '');
  const [tEmail, setTEmail] = useState(currentUser?.email || '');
  const [tPhone, setTPhone] = useState(currentUser?.phone || '');
  const [tCategory, setTCategory] = useState<'Order & Delivery' | 'Return & Refund' | 'Payment' | 'Account' | 'Other'>('Order & Delivery');
  const [tSubject, setTSubject] = useState('');
  const [tMessage, setTMessage] = useState('');
  const [tScreenshot, setTScreenshot] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [ticketSubmitSuccess, setTicketSubmitSuccess] = useState(false);

  // Sync user values if the logged-in user changes
  useEffect(() => {
    if (currentUser) {
      setTName(currentUser.name);
      setTEmail(currentUser.email);
      if (currentUser.phone) setTPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Handle Drag & Drop / manual upload
  const handleFile = (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(lang === 'en' ? 'File size must be less than 2MB' : 'ফাইলের সাইজ অবশ্যই ২ মেগাবাইটের কম হতে হবে');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setTScreenshot(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: lang === 'en' 
        ? "Hello! Welcome to our Support Center. I am your automated AI Help Assistant. How may I assist you today?"
        : "হ্যালো! আমাদের সাপোর্ট সেন্টারে আপনাকে স্বাগতম। আমি আপনার স্বয়ংক্রিয় এআই অ্যাসিস্ট্যান্ট। কীভাবে আপনাকে সাহায্য করতে পারি?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Handle Ticket Form Submission
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tEmail.trim() || !tSubject.trim() || !tMessage.trim()) return;

    const ticketId = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      userId: currentUser?.id || 'guest',
      name: tName,
      email: tEmail,
      phone: tPhone,
      category: tCategory,
      subject: tSubject,
      message: tMessage,
      screenshot: tScreenshot || undefined,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString()
    };

    setTickets(prev => [newTicket, ...prev]);
    setTicketSubmitSuccess(true);
    setTSubject('');
    setTMessage('');
    setTScreenshot('');

    // Send instant Bot response acknowledging ticket if chatbot is used
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: lang === 'en'
          ? `We have received your ticket! A personal customer support agent has been assigned. Ticket ID: ${ticketId}. We will get back to you within 2-4 hours.`
          : `আপনার অভিযোগটি আমাদের কাছে জমা হয়েছে! একজন সাপোর্ট এজেন্ট আপনার বিষয়টি দেখছেন। কমপ্লেইন আইডি: ${ticketId}। আমরা পরবর্তী ২-৪ ঘণ্টার মধ্যে মেইল অথবা ফোনে যোগাযোগ করব।`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setTimeout(() => {
      setTicketSubmitSuccess(false);
    }, 5000);
  };

  // Bot auto responses logic
  const handleBotResponse = (userQuery: string) => {
    setIsBotTyping(true);
    const query = userQuery.toLowerCase().trim();

    setTimeout(() => {
      let botResponse = "";

      // Check if query contains ANO order format e.g. ANO-7821
      const orderIdMatch = query.match(/ano-\d{4}/i);
      
      if (orderIdMatch) {
        const searchedId = orderIdMatch[0].toUpperCase();
        const matchedOrder = orders.find(o => o.id === searchedId);

        if (matchedOrder) {
          const statusBn = matchedOrder.status === OrderStatus.PENDING ? 'পেন্ডিং (Pending)'
            : matchedOrder.status === OrderStatus.CONFIRMED ? 'ধাপ ১: কনফার্মড (Confirmed)'
            : matchedOrder.status === OrderStatus.SHIPPED ? 'ধাপ ২: শিপিং চলমান (Shipped)'
            : matchedOrder.status === OrderStatus.DELIVERED ? 'ধাপ ৩: সফলভাবে ডেলিভারি সম্পন্ন (Delivered)'
            : 'বাতিল (Cancelled)';
          
          botResponse = lang === 'en'
            ? `Order Found! Here are the details for tracking id ${searchedId}:\n- Status: ${matchedOrder.status}\n- Total amount: ৳${matchedOrder.totalAmount}\n- Delivery address: ${matchedOrder.address}\nWe are working diligently to deliver your package.`
            : `আপনার অর্ডারটি পাওয়া গেছে! আইডি ${searchedId}-এর লাইভ ট্র্যাকিং তথ্য নিম্নরূপ:\n- বর্তমান কন্ডিশন: ${statusBn}\n- মোট ভ্যালু: ৳${matchedOrder.totalAmount}\n- শিপিং অ্যাড্রেস: ${matchedOrder.address}\nআমাদের শিপিং টিম প্রোডাক্টটি দ্রুত পৌঁছে দেওয়ার চেষ্টা করছে।`;
        } else {
          botResponse = lang === 'en'
            ? `Sorry, we could not find any order with tracking ID: ${searchedId} in this session. Please double check the ID format (e.g. ANO-7821).`
            : `দুঃখিত, এই ব্রাউজার সেশনে ${searchedId} টিকিট দিয়ে কোনো অর্ডার খুঁজে পাওয়া যায়নি। দয়া করে আপনার মেমোরি রিসিট দেখে আইডি সঠিক করে পুনরায় ট্রাই করুন (যেমন: ANO-7821)।`;
        }
      } 
      // Query about refund/returns
      else if (query.includes('refund') || query.includes('return') || query.includes('রিটার্ন') || query.includes('রিফান্ড') || query.includes('ফেরত')) {
        botResponse = lang === 'en'
          ? "Our Refund Policy: If any product is damaged or mismatched, you have a 7-day replacement policy. Please submit a Support Ticket below with pictures to initiate returns instantly."
          : "রিটার্ন এবং রিফান্ড পলিসি: পণ্য পাওয়ার পর কোনো সমস্যা বা ত্রুটি থাকলে আপনি ৭ দিনের মধ্যে পরিবর্তন বা অফিশিয়াল রিফান্ড রিকোয়েস্ট করতে পারেন। কোনো ট্র্যাকিং বা অতিরিক্ত ফেরত চার্জ প্রযোজ্য হবে না। নিচে একটি সাপোর্ট বা কমপ্লেইন টিকিট ইস্যু করুন এবং সেখানে ছবি স্ক্রিনশট হিসেবে দিতে পারেন।";
      }
      // Query about shipping/delivery status
      else if (query.includes('delivery') || query.includes('shipping') || query.includes('ডেলিভারি') || query.includes('কুরিয়ার') || query.includes('শিপিং')) {
        botResponse = lang === 'en'
          ? "Delivery Timelines: Inside Dhaka takes 24-48 hours. Outside Dhaka takes 3-4 days. Free delivery is automatically applied on orders above 1,500 Taka!"
          : "ডেলিভারি সময়সীমা: ঢাকা সিটির ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ৩ থেকে ৪ দিন সময় লাগতে পারে। ১,৫০০ টাকার অধিক সকল অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!";
      }
      // Query about agent/human help
      else if (query.includes('agent') || query.includes('human') || query.includes('কথা') || query.includes('এজেন্ট') || query.includes('কল') || query.includes('যোগাযোগ')) {
        botResponse = lang === 'en'
          ? "To speak with an agent, please open a formal Support Ticket below with details, or dial our helper helpline 09612-ANONO (10 AM to 8 PM)."
          : "সরাসরি সাপোর্ট এজেন্টের সাথে কথা বলতে দয়া করে নিচে একটি সাপোর্ট টিকিট জমা দিন অথবা সরাসরি কল করুন আমাদের হটলাইন ০৯৬১২-ANONO নাম্বারে (প্রতিদিন সকাল ১০ টা থেকে রাত ৮ টা)।";
      }
      // Default auto helper response
      else {
        botResponse = lang === 'en'
          ? "I am ANONO's Automated Bot. You can track your order by entering your Order ID (e.g: ANO-7821), or ask me about delivery times, refunds, and payment issues."
          : "আমি অ্যানোনোর স্বয়ংক্রিয় এআই অ্যাসিস্ট্যান্ট। অর্ডার লাইভ ট্র্যাকিং করার জন্য আইডি দিন (যেমন: ANO-7821) অথবা কুপন, ডেলিভারি রুলস, রিফান্ড পলিসি বা পেমেন্ট সম্পর্কিত যেকোনো কিছু জিজ্ঞেস করতে পারেন।";
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsBotTyping(false);
    }, 1000);
  };

  // Chat message submit handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const userText = userChatInput;
    setUserChatInput('');

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    handleBotResponse(userText);
  };

  // Quick Action Buttons click handler
  const handleQuickAction = (action: 'track' | 'refund' | 'agent') => {
    let text = '';
    if (action === 'track') {
      text = lang === 'en' ? 'Track order ANO-7821' : 'ANO-7821 অর্ডার ট্র্যাক করুন';
    } else if (action === 'refund') {
      text = lang === 'en' ? 'What is your refund policy?' : 'আপনাদের রিফান্ড পলিসি কী?';
    } else if (action === 'agent') {
      text = lang === 'en' ? 'Connect to help desk agent' : 'কাস্টমার সাপোর্ট এজেন্টের সাথে সহযোগিতা';
    }

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    handleBotResponse(text);
  };

  // FAQ filtering
  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      faq.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.questionBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answerEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answerBn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Upper Welcome and Branding banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/80 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-600 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
              <LifeBuoy className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{lang === 'en' ? 'Support Desk Mode' : 'গ্রাহক সেবা ও টিকিট পোর্টাল'}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-neutral-850 tracking-tight">
              {lang === 'en' ? 'ANONO Interactive Help Center' : 'অ্যানোনো কাস্টমার কেয়ার ও সাপোর্ট হাব'}
            </h1>
            <p className="text-xs md:text-sm text-neutral-550 font-semibold leading-relaxed">
              {lang === 'en' 
                ? 'Welcome to ANONO Support Desk. Find instant solutions across all categories, chat with our smart AI assistant, or launch direct formal tickets in clicks!'
                : 'পণ্য ডেলিভারি, রিফান্ড পলিসি, বা অর্ডার ট্র্যাকিং জটিলতার সবচেয়ে দ্রুত সমাধান পেতে নিচের হেল্প সেন্টার ও টিকিট পোর্টালটি আপনার সেবায় সদা নিয়োজিত।'}
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center bg-white p-4 rounded-2xl shadow-md border border-neutral-100 hidden md:flex">
            <LifeBuoy className="w-16 h-16 text-indigo-600 animate-spin-slow" />
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Span 7): Search, FAQs & Tickets Submission */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* FAQ Card Container */}
          <div className="bg-white rounded-3xl border border-neutral-200/60 p-5 md:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base md:text-lg font-extrabold text-neutral-850">
                  {lang === 'en' ? 'Self-Service Knowledgebase (FAQ)' : 'স্বয়ংক্রিয় সাধারণ জিজ্ঞাসা সমাধান (FAQ)'}
                </h2>
              </div>
              <span className="bg-neutral-100 text-neutral-600 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                LEVEL 1
              </span>
            </div>

            {/* Live Search and filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder={lang === 'en' ? "Search for policies, shipping, charges..." : "পণ্য পরিবর্তন, ডেলিভারি চার্জ বা চার্জ ফেইল হওয়া লিখে সার্চ করুন..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-750 placeholder:text-neutral-400 focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              {/* Tag filters */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { key: 'all', labelEn: 'All FAQ', labelBn: 'সব বিষয়' },
                  { key: 'delivery', labelEn: 'Delivery', labelBn: 'ডেলিভারি' },
                  { key: 'refund', labelEn: 'Refunds', labelBn: 'রিটার্ন-রিফান্ড' },
                  { key: 'payment', labelEn: 'Payments', labelBn: 'পেমেন্ট ইস্যু' },
                  { key: 'account', labelEn: 'My Account', labelBn: 'অ্যাকাউন্ট' }
                ].map((tag) => {
                  const isActive = selectedCategory === tag.key;
                  return (
                    <button
                      key={tag.key}
                      onClick={() => setSelectedCategory(tag.key as any)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-150'
                      }`}
                    >
                      {lang === 'en' ? tag.labelEn : tag.labelBn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FAQ Accordion List */}
            <div className="space-y-3.5 pt-2">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaq === faq.id;
                  return (
                    <div 
                      key={faq.id} 
                      className="border border-neutral-150 rounded-2xl overflow-hidden transition-all bg-white hover:border-neutral-250 shadow-3xs"
                    >
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                        className="w-full flex items-center justify-between gap-4 p-4 text-left cursor-pointer transition-colors hover:bg-neutral-50/50"
                      >
                        <span className="text-xs md:text-sm font-extrabold text-neutral-800 leading-snug">
                          {lang === 'en' ? faq.questionEn : faq.questionBn}
                        </span>
                        <span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                          )}
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-neutral-50/70 border-t border-neutral-100 overflow-hidden"
                          >
                            <div className="p-4 text-xs font-semibold text-neutral-550 leading-relaxed">
                              {lang === 'en' ? faq.answerEn : faq.answerBn}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-neutral-450 font-bold">
                  {lang === 'en' ? 'No matching answers found in knowledgebase.' : 'সার্চের সাথে মিলে যায় এমন কোনো সাধারণ জিজ্ঞাসা খুঁজে পাওয়া যায়নি।'}
                </div>
              )}
            </div>
          </div>

          {/* LEVEL 3: Create Support Ticket / Complaint Form */}
          <div className="bg-white rounded-3xl border border-neutral-200/60 p-5 md:p-7 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-extrabold text-neutral-850 uppercase tracking-widest flex items-center gap-2">
                <span>📝</span>
                <span>
                  {lang === 'en' ? 'Create New Support Complaint Ticket' : 'একটি নতুন সাপোর্ট ও অভিযোগ টিকিট তৈরী করুন'}
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400 font-semibold mt-0.5">
                {lang === 'en' 
                  ? 'Submit your case below. Our online team will immediately answer in your Support Center dashboard.' 
                  : 'নিচের ফর্মে আপনার অভিযোগ বা জিজ্ঞাসা জমা দিন। আমাদের সাপোর্ট টিম দ্রুত ব্যবস্থা নিয়ে এখানে রিপ্লাই দিবে।'}
              </p>
            </div>

            {ticketSubmitSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm select-none">
                  ✅
                </div>
                <span className="text-xs font-bold text-emerald-800">
                  {lang === 'en' 
                    ? 'Complaint ticket submitted successfully! Track live updates at bottom of this page.' 
                    : 'আপনার অভিযোগ টিকিট সফলভাবে সংরক্ষিত হয়েছে! নিচের "আমার আগের টিকিটসমূহ" ট্র্যাকিং তালিকায় এর লাইভ অবস্থা দেখতে পারবেন।'}
                </span>
              </motion.div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider block">
                    {lang === 'en' ? 'Full Name' : 'পূর্ণ নাম'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={tName}
                      onChange={(e) => setTName(e.target.value)}
                      placeholder={lang === 'en' ? "Your Name" : "যেমন: রাহাত ইসলাম"}
                      required
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-neutral-850"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider block">
                    {lang === 'en' ? 'Email Address' : 'ই-মেইল অ্যাড্রেস'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      value={tEmail}
                      onChange={(e) => setTEmail(e.target.value)}
                      placeholder="rahat@gmail.com"
                      required
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-neutral-850"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider block">
                    {lang === 'en' ? 'Mobile Number' : 'মোবাইল নাম্বার'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={tPhone}
                      onChange={(e) => setTPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-neutral-850"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                <div className="space-y-1 md:col-span-1">
                  <label className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider block">
                    {lang === 'en' ? 'Topic Category' : 'অভিযোগের মেইন ক্যাটাগরি'}
                  </label>
                  <select
                    value={tCategory}
                    onChange={(e: any) => setTCategory(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-750 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Order & Delivery">{lang === 'en' ? 'Order & Delivery' : 'অর্ডার ও ডেলিভারি'}</option>
                    <option value="Return & Refund">{lang === 'en' ? 'Return & Refund' : 'রিটার্ন ও রিফান্ড নীতি'}</option>
                    <option value="Payment">{lang === 'en' ? 'Payment Issue' : 'পেমেন্ট জটিলতা'}</option>
                    <option value="Account">{lang === 'en' ? 'Account Issue' : 'অ্যাকাউন্ট সেটিংস'}</option>
                    <option value="Other">{lang === 'en' ? 'Other Inquiry' : 'অন্যান্য সাধারণ সাহায্য'}</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-3">
                  <label className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider block">
                    {lang === 'en' ? 'Complaint / Inquiry Subject' : 'অভিযোগ বা জিজ্ঞাসার মূল বিষয় (Subject)'}
                  </label>
                  <input
                    type="text"
                    value={tSubject}
                    onChange={(e) => setTSubject(e.target.value)}
                    placeholder={lang === 'en' ? "Please explain in a short sentence" : "সংক্ষেপে আপনার সমস্যার টাইটেল লিখুন"}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-neutral-850"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider block">
                  {lang === 'en' ? 'Detailed Description' : 'সমস্যার বিস্তারিত বিবরণ'}
                </label>
                <textarea
                  value={tMessage}
                  onChange={(e) => setTMessage(e.target.value)}
                  placeholder={lang === 'en' ? "Describe your issue with Order id, or bKash / Nagad transaction description..." : "আপনার অর্ডারের বিবরণ, বিকাশ ট্রানজেকশন নাম্বার ইত্যাদি স্পষ্ট করে উল্লেখ করুন..."}
                  required
                  rows={4}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-neutral-850"
                />
              </div>

              {/* Drag-and-Drop + Manual file upload zone */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider block">
                  {lang === 'en' ? 'Attach Problem Screenshot (Optional)' : 'সমস্যার স্ক্রিনশট যুক্ত করুন (ঐচ্ছিক)'}
                </label>
                
                {!tScreenshot ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      dragActive
                        ? 'border-indigo-500 bg-indigo-50/45'
                        : 'border-neutral-250 hover:border-indigo-400 bg-neutral-50/30'
                    }`}
                    onClick={() => document.getElementById('screenshot-upload')?.click()}
                  >
                    <input
                      id="screenshot-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFile(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 border border-neutral-150 shadow-3xs text-lg select-none">
                      📸
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-neutral-700">
                        {lang === 'en' ? 'Drag & drop image here or click to browse' : 'যেকোনো ছবি এখানে ড্র্যাগ করুন অথবা ব্রাউজ করতে ক্লিক করুন'}
                      </p>
                      <p className="text-[9.5px] text-neutral-400 font-semibold">
                        {lang === 'en' ? 'Supports JPEG, PNG up to 2MB' : '২ মেগাবাইট সাইজের মধ্যে JPEG ও PNG ফরমেট সাপোর্ট করে'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-50 p-2.5 max-w-sm flex items-center gap-3">
                    <img 
                      src={tScreenshot} 
                      alt="Screenshot Preview" 
                      className="w-14 h-14 object-cover rounded-lg border border-neutral-150"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-wider block">Attached / যুক্ত স্ক্রিনশট</span>
                      <p className="text-[10.5px] font-bold text-neutral-700 truncate">screenshot_image.png</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTScreenshot('')}
                      className="text-[10px] font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-xl border border-rose-100 cursor-pointer text-center"
                    >
                      {lang === 'en' ? 'Remove' : 'ফেলে দিন'}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Submit Complaint Ticket' : 'কমপ্লেইন টিকিট জমা দিন'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* User's tickets list */}
          <div className="bg-white rounded-3xl border border-neutral-200/60 p-5 md:p-7 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-widest flex items-center gap-2 border-b border-neutral-100 pb-3">
              <span>🎟️</span>
              <span>
                {lang === 'en' ? 'My Filed Support Tickets' : 'আমার ফাইলকৃত অভিযোগ ও সাপোর্ট টিকিটসমূহ'}
              </span>
              <span className="bg-neutral-100 text-neutral-600 rounded-full font-mono text-[9px] px-2 py-0.5">
                {tickets.filter(t => t.userId === (currentUser?.id || 'guest')).length}
              </span>
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {tickets.filter(t => t.userId === (currentUser?.id || 'guest')).length > 0 ? (
                tickets
                  .filter(t => t.userId === (currentUser?.id || 'guest'))
                  .map((t) => (
                    <div key={t.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/50 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-black text-indigo-700">{t.id}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-neutral-450 font-bold">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            t.status === TicketStatus.OPEN 
                              ? 'bg-yellow-105 bg-amber-100 text-amber-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {t.status === TicketStatus.OPEN 
                              ? (lang === 'en' ? 'Open (Pending)' : 'চলমান/পেন্ডিং') 
                              : (lang === 'en' ? 'Resolved' : 'সমাধানকৃত')}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold text-neutral-800 block">{t.subject}</span>
                        <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">{t.message}</p>
                        {t.screenshot && (
                          <div className="pt-2">
                            <span className="text-[9px] font-extrabold text-neutral-450 block uppercase tracking-wider mb-1">
                              {lang === 'en' ? 'Attached Screenshot:' : 'যুক্ত স্ক্রিনশট:'}
                            </span>
                            <img 
                              src={t.screenshot} 
                              alt="Ticket Screenshot" 
                              className="max-h-24 object-cover rounded-xl border border-neutral-200 shadow-3xs"
                            />
                          </div>
                        )}
                      </div>

                      {t.response && (
                        <div className="mt-2.5 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                          <span className="text-[10px] font-extrabold text-indigo-800 flex items-center gap-1 select-none">
                            <span>💬</span>
                            <span>{lang === 'en' ? 'Support Rep Response:' : 'কাস্টমার কেয়ার টিম রিপ্লাই:'}</span>
                          </span>
                          <p className="text-[11.5px] font-bold text-neutral-750 italic">
                            "{t.response}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <div className="text-center py-6 text-[11px] text-neutral-400 font-semibold italic bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  {lang === 'en' ? 'You have not filed any tickets yet.' : 'আপনি পূর্বে কোনো অভিযোগ বা সাপোর্ট টিকিট খোলেননি।'}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (Span 5): LEVEL 2 - AI Automated Bot Workflow */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-neutral-200/60 p-4 md:p-6 shadow-xs space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm md:text-base font-black text-neutral-850">
                  {lang === 'en' ? 'Instant AI Automations Bot' : 'ইনস্ট্যান্ট এআই চ্যাটবট অ্যাসিস্ট্যান্ট'}
                </h2>
              </div>
              <span className="bg-emerald-100 text-emerald-850 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                LEVEL 2
              </span>
            </div>

            {/* Quick action buttons inside bot panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickAction('track')}
                className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 rounded-xl px-2.5 py-2 text-left text-[10px] font-extrabold transition-all text-indigo-850"
              >
                🔍 {lang === 'en' ? 'Track Default Order' : 'অর্ডার ট্র্যাক করুন'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickAction('refund')}
                className="bg-purple-50 hover:bg-purple-100 border border-purple-150 rounded-xl px-2.5 py-2 text-left text-[10px] font-extrabold transition-all text-purple-850"
              >
                🔄 {lang === 'en' ? 'Return & Refunds' : 'রিটার্ন ও রিফান্ড নীতি'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickAction('agent')}
                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 rounded-xl px-2.5 py-2 text-left text-[10px] font-extrabold transition-all text-emerald-850"
              >
                📞 {lang === 'en' ? 'Connect to Agent' : 'এজেন্টের সহযোগিতা'}
              </button>
            </div>

            {/* Interactive Chat Board area */}
            <div className="border border-neutral-200/70 rounded-2xl h-[380px] flex flex-col bg-neutral-50 overflow-hidden shadow-xs relative">
              <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl text-[11.5px] font-semibold leading-relaxed shadow-3xs ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white text-neutral-800 border border-neutral-150 rounded-bl-none'
                    }`}>
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>
                    <span className="text-[8.5px] text-neutral-400 font-bold mt-1 px-1">{msg.time}</span>
                  </div>
                ))}

                {isBotTyping && (
                  <div className="flex items-center gap-1 bg-white p-2.5 rounded-xl border border-neutral-150 mr-auto max-w-[60px] shadow-3xs">
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>

              {/* Chat formulation typing bar */}
              <form onSubmit={handleSendMessage} className="p-2 border-t border-neutral-200 bg-white flex items-center gap-1">
                <input
                  type="text"
                  placeholder={lang === 'en' ? "Ask anything or paste Order ID (ANO-xxxx)" : "এখানে লিখুন অথবা অর্ডার আইডি দিন (যেমন: ANO-7821)"}
                  value={userChatInput}
                  onChange={(e) => setUserChatInput(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-150 rounded-xl px-3 py-1.5 text-xs text-neutral-750 focus:outline-none focus:border-indigo-500 font-semibold"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all cursor-pointer flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Copy recent orders */}
            <div>
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-2">
                📂 {lang === 'en' ? 'Quick Copy Recent Orders' : 'আপনার সাম্প্রতিক অর্ডারের ট্র্যাকার কোড'}
              </span>
              <div className="space-y-1.5">
                {orders && orders.length > 0 ? (
                  orders.map((o) => (
                    <div 
                      key={o.id}
                      onClick={() => {
                        setUserChatInput(o.id);
                        setChatMessages(prev => [
                          ...prev,
                          {
                            sender: 'user',
                            text: lang === 'en' ? `Track order ${o.id}` : `আমার অর্ডার ট্র্যাক করুন ${o.id}`,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          }
                        ]);
                        handleBotResponse(o.id);
                      }}
                      className="bg-neutral-50 hover:bg-indigo-50 border border-neutral-150 rounded-xl px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-all active:scale-98 select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-indigo-700 text-[11px]">{o.id}</span>
                        <span className="text-[10.5px] text-neutral-500 font-bold">({o.name})</span>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 hover:underline">
                        {lang === 'en' ? 'Auto Track' : 'অটো ট্র্যাক'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10.5px] font-bold italic text-neutral-400">
                    {lang === 'en' ? 'No orders created in this browser session yet.' : 'আপনার এই ব্রাউজার সেশনে কোনো অর্ডার রেকর্ড নেই।'}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
