import { useState, FormEvent } from 'react';
import { Order, OrderStatus } from '../types';
import { Search, Clock, CheckCircle, Truck, Package, XCircle, AlertCircle, ShoppingBag, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, formatPrice, formatNum, t, getTranslatedProduct } from '../data/translations';

interface OrderTrackerProps {
  orders: Order[];
  lang?: Language;
}

export default function OrderTracker({ orders, lang = 'bn' }: OrderTrackerProps) {
  const [searchId, setSearchId] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(orders.length > 0 ? orders[orders.length - 1] : null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = orders.find(
      o => o.id.toLowerCase() === searchId.trim().toLowerCase() || o.id.toLowerCase().includes(searchId.trim().toLowerCase())
    );
    if (found) {
      setActiveOrder(found);
      setErrorMsg('');
    } else {
      setErrorMsg(lang === 'en' 
        ? 'Sorry, this order ID or number was not found!' 
        : 'দুঃখিত, এই অর্ডার আইডি বা নম্বরটি খুঁজে পাওয়া যায়নি!');
    }
  };

  const getStatusStepClass = (currentStatus: OrderStatus, stepType: OrderStatus) => {
    const statusPriority = {
      [OrderStatus.PENDING]: 1,
      [OrderStatus.CONFIRMED]: 2,
      [OrderStatus.SHIPPED]: 3,
      [OrderStatus.DELIVERED]: 4,
      [OrderStatus.CANCELLED]: 0
    };

    if (currentStatus === OrderStatus.CANCELLED) {
      if (stepType === OrderStatus.CANCELLED) return 'bg-rose-100 text-rose-600 border-rose-200';
      return 'bg-neutral-50 text-neutral-300 border-neutral-100';
    }

    if (stepType === OrderStatus.CANCELLED) return 'hidden';

    const currentPriority = statusPriority[currentStatus];
    const stepPriority = statusPriority[stepType];

    if (currentPriority >= stepPriority) {
      return 'bg-indigo-600 text-white border-indigo-600';
    }
    return 'bg-white text-neutral-400 border-neutral-200';
  };

  const getStatusHeader = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return { 
          text: lang === 'en' ? 'Order Pending' : 'অর্ডার পেন্ডিং (অপেক্ষমান)', 
          color: 'text-amber-500 bg-amber-50 border-amber-200' 
        };
      case OrderStatus.CONFIRMED:
        return { 
          text: lang === 'en' ? 'Order Confirmed' : 'অর্ডার নিশ্চিত করা হয়েছে', 
          color: 'text-sky-600 bg-sky-50 border-sky-100' 
        };
      case OrderStatus.SHIPPED:
        return { 
          text: lang === 'en' ? 'Delivery Shipped (On the way)' : 'ডেলিভারি রাস্তায় রয়েছে', 
          color: 'text-indigo-650 bg-indigo-50 border-indigo-100' 
        };
      case OrderStatus.DELIVERED:
        return { 
          text: lang === 'en' ? 'Order Delivered Successfully' : 'ডেলিভারি সম্পন্ন হয়েছে', 
          color: 'text-emerald-600 bg-emerald-50 border-emerald-100' 
        };
      case OrderStatus.CANCELLED:
        return { 
          text: lang === 'en' ? 'Order Cancelled' : 'অর্ডার বাতিল করা হয়েছে', 
          color: 'text-rose-600 bg-rose-50 border-rose-100' 
        };
    }
  };

  const activeHeader = activeOrder ? getStatusHeader(activeOrder.status) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="text-center space-y-2 font-sans">
        <h2 className="text-2xl font-extrabold text-neutral-800 tracking-tight">{t('tracker_title', lang)}</h2>
        <p className="text-sm text-neutral-500 max-w-lg mx-auto">
          {t('tracker_desc', lang)}
        </p>
      </div>

      {/* Tracker Search Form */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-grow font-sans">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder={t('tracker_placeholder', lang)}
            className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-700 shadow-md transition-colors cursor-pointer font-sans"
        >
          {t('tracker_search_btn', lang)}
        </button>
      </form>

      {errorMsg && (
        <div className="max-w-md mx-auto text-center bg-rose-50 text-rose-600 rounded-xl px-4 py-2 border border-rose-100 flex items-center justify-center gap-1.5 font-sans text-xs">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {activeOrder ? (
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-3">
          {/* Left panel: Info Summary */}
          <div className="p-6 bg-neutral-50/70 border-r border-neutral-100 space-y-4 font-sans">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider font-sans">{t('tracker_order_id', lang)}</span>
              <p className="font-mono text-sm font-bold text-neutral-800">{activeOrder.id}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider font-sans">{t('tracker_date_time', lang)}</span>
              <p className="text-xs text-neutral-700 font-medium font-sans">
                {new Date(activeOrder.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider font-sans">{t('tracker_delivery_address', lang)}</span>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">{activeOrder?.name}</p>
              <p className="text-xs text-neutral-400 font-sans">{activeOrder?.phone}</p>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans mt-1 rounded-lg bg-white border border-neutral-150 p-2">
                {activeOrder?.address}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider font-sans">{t('tracker_payment_method', lang)}</span>
              <p className="text-xs font-semibold text-neutral-700 font-sans">
                {activeOrder.paymentMethod === 'Cash on Delivery' 
                  ? (lang === 'en' ? 'Cash on Delivery' : 'ক্যাশ অন ডেলিভারি')
                  : activeOrder.paymentMethod}
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-200">
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider font-sans">{t('tracker_grand_total', lang)}</span>
              <p className="text-lg font-extrabold text-indigo-600">{formatPrice(activeOrder.totalAmount, lang)}</p>
            </div>
          </div>

          {/* Right panel: Active Tracking visual Progress */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between font-sans">
            {/* Live Badge */}
            <div className="flex justify-between items-center mb-6 font-sans">
              <span className="text-xs font-bold text-neutral-500">{t('tracker_live_status', lang)}</span>
              {activeHeader && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${activeHeader.color}`}>
                  {activeHeader.text}
                </span>
              )}
            </div>

            {/* Steps Track */}
            {activeOrder.status === OrderStatus.CANCELLED ? (
              <div className="my-8 flex items-center justify-center p-6 border border-dashed border-rose-200 bg-rose-50/50 rounded-2xl">
                <div className="text-center space-y-2">
                  <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
                  <p className="font-bold text-rose-800 text-sm">
                    {lang === 'en' ? 'Sorry, this order was cancelled!' : 'দুঃখিত, পণ্যটি বাতিল করা হয়েছে!'}
                  </p>
                  <p className="text-xs text-rose-600 max-w-md">
                    {lang === 'en'
                      ? 'Our customer representatives cancelled this order due to stock insufficiency or other issues. Please contact support for assistance.'
                      : 'আমাদের কাস্টমার রিপ্রেজেন্টটেটিভ অর্ডারটি রিভিউ করার পর স্টক অপর্যাপ্ততা অথবা অন্য কোনো কারণে এটি বাতিল করা হয়েছে। বিস্তারিত জানতে যোগাযোগ করুন।'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative my-8 flex justify-between font-sans">
                {/* Horizontal progress Connector Line */}
                <div className="absolute top-[17px] left-8 right-8 h-1 bg-neutral-100 -z-10">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{
                      width:
                        activeOrder.status === OrderStatus.PENDING
                          ? '0%'
                          : activeOrder.status === OrderStatus.CONFIRMED
                          ? '33%'
                          : activeOrder.status === OrderStatus.SHIPPED
                          ? '66%'
                          : '100%',
                    }}
                  />
                </div>

                {/* Step 1: Pending */}
                <div className="flex flex-col items-center text-center w-16">
                  <div
                    className={`w-[36px] h-[36px] rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-md transition-all ${getStatusStepClass(
                      activeOrder.status,
                      OrderStatus.PENDING
                    )}`}
                  >
                    {formatNum(1, lang)}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700 mt-2">{t('tracker_step_received', lang)}</span>
                </div>

                {/* Step 2: Confirmed */}
                <div className="flex flex-col items-center text-center w-16">
                  <div
                    className={`w-[36px] h-[36px] rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-md transition-all ${getStatusStepClass(
                      activeOrder.status,
                      OrderStatus.CONFIRMED
                    )}`}
                  >
                    {formatNum(2, lang)}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700 mt-2">{t('tracker_step_confirmed', lang)}</span>
                </div>

                {/* Step 3: Shipped */}
                <div className="flex flex-col items-center text-center w-16">
                  <div
                    className={`w-[36px] h-[36px] rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-md transition-all ${getStatusStepClass(
                      activeOrder.status,
                      OrderStatus.SHIPPED
                    )}`}
                  >
                    {formatNum(3, lang)}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700 mt-2">{t('tracker_step_shipped', lang)}</span>
                </div>

                {/* Step 4: Delivered */}
                <div className="flex flex-col items-center text-center w-16">
                  <div
                    className={`w-[36px] h-[36px] rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-md transition-all ${getStatusStepClass(
                      activeOrder.status,
                      OrderStatus.DELIVERED
                    )}`}
                  >
                    {formatNum(4, lang)}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700 mt-2">{t('tracker_step_delivered', lang)}</span>
                </div>
              </div>
            )}

            {/* Listing order items breakdown */}
            <div className="border-t border-neutral-100 pt-4 space-y-3 font-sans">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400 block mb-1.5">{t('tracker_order_items', lang)}</span>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                {(activeOrder?.items || []).map((it, idx) => {
                  if (!it) return null;
                  const transP = getTranslatedProduct(it.product, lang);
                  const pName = transP?.name || (lang === 'en' ? 'Product' : 'পণ্য');
                  const pImg = it.product?.image || '';
                  const pPrice = it.product?.price || 0;
                  const qty = it.quantity || 1;
                  return (
                    <div key={idx} className="flex justify-between items-center bg-neutral-50 px-3 py-2 rounded-xl text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={pImg}
                          alt={pName}
                          className="w-8 h-8 rounded-md object-cover border"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                        <span className="font-semibold text-neutral-700 line-clamp-1 max-w-[200px]">
                          {pName}
                        </span>
                      </div>
                      <span className="text-neutral-400 font-mono text-[11px]">
                        {formatPrice(pPrice, lang)} × {formatNum(qty, lang)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-12 text-center text-neutral-400 font-sans">
          <ShoppingBag className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-neutral-700 mb-1">{t('tracker_empty_title', lang)}</p>
          <p className="text-xs">{t('tracker_empty_desc', lang)}</p>
        </div>
      )}

      {/* Select active Order options */}
      {orders.length > 1 && (
        <div className="space-y-1 bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100 font-sans">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{t('tracker_prev_orders', lang)}:</span>
          <div className="flex flex-wrap gap-2 pt-1.5">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveOrder(o)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  activeOrder?.id === o.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {o.id} - {formatPrice(o.totalAmount, lang)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
