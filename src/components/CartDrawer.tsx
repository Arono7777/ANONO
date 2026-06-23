import { useState, useEffect, FormEvent } from 'react';
import { CartItem, Order } from '../types';
import { ShoppingBag, X, Trash2, ShieldCheck, Ticket, User, Phone, MapPin, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, formatPrice, formatNum, t, getTranslatedProduct } from '../data/translations';

interface CartDrawerProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (orderDetails: {
    name: string;
    phone: string;
    address: string;
    paymentMethod: 'bKash' | 'Nagad' | 'Cash on Delivery';
  }) => void;
  lang?: Language;
  initialCheckoutActive?: boolean;
  currentUser?: import('../types').User | null;
  onRequireAuth?: () => void;
}

export default function CartDrawer({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  lang = 'bn',
  initialCheckoutActive = false,
  currentUser = null,
  onRequireAuth = () => {}
}: CartDrawerProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Cash on Delivery'>('Cash on Delivery');
  const [isCheckoutFormActive, setIsCheckoutFormActive] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialCheckoutActive && !currentUser) {
        setIsCheckoutFormActive(false);
        onRequireAuth();
      } else {
        setIsCheckoutFormActive(initialCheckoutActive);
      }
    }
  }, [isOpen, initialCheckoutActive, currentUser]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
    } else {
      setName('');
      setPhone('');
      setIsCheckoutFormActive(false);
    }
  }, [currentUser]);

  // Cart math
  const itemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const originalSubTotal = cart.reduce((total, item) => total + item.product.originalPrice * item.quantity, 0);
  const totalSavings = originalSubTotal - subTotal;
  const deliveryCharge = subTotal > 1500 || subTotal === 0 ? 0 : 60;
  const grandTotal = subTotal + deliveryCharge - appliedDiscount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ANONO50') {
      setAppliedDiscount(50);
      setErrorMessage('');
    } else if (promoCode.trim().toUpperCase() === 'ANONO15') {
      setAppliedDiscount(Math.round(subTotal * 0.15));
      setErrorMessage('');
    } else {
      setErrorMessage(lang === 'en'
        ? 'Invalid coupon! Use "ANONO15" to get 15% discount.'
        : 'ভুল কুপন কোড! "ANONO15" ব্যবহার করে ১৫% ডিসকাউন্ট পান।');
    }
  };

  const handleSubmitCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    if (!name.trim()) return setErrorMessage(lang === 'en' ? 'Please enter your name.' : 'দয়া করে আপনার নাম লিখুন।');
    if (!phone.trim() || phone.trim().length < 11) {
      return setErrorMessage(lang === 'en' ? 'Please enter a valid 11-digit mobile number.' : 'একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।');
    }
    if (!address.trim()) return setErrorMessage(lang === 'en' ? 'Please enter delivery address.' : 'ডেলিভারি ঠিকানা প্রদান করুন।');

    onCheckout({
      name,
      phone,
      address,
      paymentMethod
    });

    // Reset Form
    setName('');
    setPhone('');
    setAddress('');
    setPaymentMethod('Cash on Delivery');
    setIsCheckoutFormActive(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950 z-50 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl z-50 flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-neutral-800 text-md">{t('cart_title', lang)} ({formatNum(itemsCount, lang)})</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main scrollable body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {!isCheckoutFormActive ? (
                // Cart Items UI
                cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400">
                    <div className="bg-neutral-100 p-4 rounded-full mb-4">
                      <ShoppingBag className="w-12 h-12 text-neutral-300" />
                    </div>
                    <p className="text-sm font-semibold mb-1">{t('cart_empty', lang)}</p>
                    <p className="text-xs">{t('cart_empty_desc', lang)}</p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                    >
                      {t('cart_start_shopping', lang)}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => {
                      const transP = getTranslatedProduct(item.product, lang);
                      return (
                        <div
                          key={item.product.id}
                          className="flex gap-3 bg-white p-3 rounded-xl border border-neutral-100 shadow-xs relative group"
                        >
                          {/* Image */}
                          <div className="w-20 h-20 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={item.product.image}
                              alt={transP.name}
                              className="object-cover max-h-full max-w-full"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80';
                              }}
                            />
                          </div>

                          {/* Infomation */}
                          <div className="flex-grow flex flex-col justify-between py-0.5">
                            <div>
                              <h4 className="text-xs font-semibold text-neutral-800 line-clamp-2 pr-6 mb-1">
                                {transP.name}
                              </h4>
                              <span className="text-[10px] text-gray-400 font-medium">{transP.category}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-indigo-600">
                                  {formatPrice(item.product.price * item.quantity, lang)}
                                </span>
                                {item.quantity > 1 && (
                                  <span className="text-[10px] text-neutral-400">
                                    ({formatPrice(item.product.price, lang)} × {formatNum(item.quantity, lang)})
                                  </span>
                                )}
                              </div>

                              {/* Quantity buttons */}
                              <div className="flex items-center border border-neutral-200 bg-neutral-50/50 rounded-lg scale-90">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                  className="px-2 py-0.5 text-neutral-500 font-bold hover:bg-neutral-200 rounded-l-lg"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-bold text-neutral-700 min-w-[20px] text-center">
                                  {formatNum(item.quantity, lang)}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product.stock}
                                  className="px-2 py-0.5 text-neutral-500 font-bold hover:bg-neutral-200 rounded-r-lg disabled:opacity-55"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Remove item button */}
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="absolute top-2 right-2 p-1 text-neutral-300 hover:text-rose-500 transition-colors cursor-pointer"
                            title={lang === 'en' ? 'Delete from cart' : 'কার্ট থেকে ডিলিট'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Promocode section */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 mt-4">
                      <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 mb-1.5">
                        <Ticket className="w-3.5 h-3.5 text-indigo-600" />
                        {t('cart_coupon_title', lang)}
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="PROMO CODE (ANONO15)"
                          className="flex-grow bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs uppercase focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-700 cursor-pointer"
                        >
                          {t('cart_coupon_apply', lang)}
                        </button>
                      </div>
                      {appliedDiscount > 0 && (
                        <p className="text-[11px] text-emerald-600 font-medium mt-1">
                          {lang === 'en' 
                            ? `Discount coupon applied successfully! Total Savings: ${formatPrice(appliedDiscount, lang)}`
                            : `ডিসকাউন্ট কুপন কোড সফলভাবে যুক্ত হয়েছে! লাভ: ${formatPrice(appliedDiscount, lang)}`}
                        </p>
                      )}
                      {errorMessage && (
                        <p className="text-[11px] text-rose-500 font-medium mt-1">{errorMessage}</p>
                      )}
                    </div>
                  </div>
                )
              ) : (
                // Checkout Delivery Form
                <form onSubmit={handleSubmitCheckout} className="space-y-4">
                  <div className="flex items-center gap-1 text-sm font-semibold text-neutral-800 border-b border-neutral-100 pb-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>{t('checkout_title', lang)}</span>
                  </div>

                  {errorMessage && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-2 rounded-xl text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  {/* Customer Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600 flex items-center gap-1">
                      <User className="w-3 h-3 text-neutral-400" /> {t('checkout_name', lang)} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('checkout_name_placeholder', lang)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Customer Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-neutral-400" /> {t('checkout_phone', lang)} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('checkout_phone_placeholder', lang)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" /> {t('checkout_address', lang)} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t('checkout_address_placeholder', lang)}
                      rows={3}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-600 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-neutral-400" /> {t('checkout_payment_method', lang)}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Cash on Delivery')}
                        className={`border rounded-xl p-2.5 text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          paymentMethod === 'Cash on Delivery'
                            ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950 font-bold'
                            : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                        }`}
                      >
                        <span className="text-[10px] sm:text-xs">
                          {lang === 'en' ? <>Cash on <br/> Delivery</> : <>ক্যাশ অন <br/> ডেলিভারি</>}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bKash')}
                        className={`border rounded-xl p-2.5 text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          paymentMethod === 'bKash'
                            ? 'border-pink-500 bg-pink-50 text-pink-950 font-bold'
                            : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                        }`}
                      >
                        <span className="text-xs text-pink-600 font-bold">bKash</span>
                        <span className="text-[9px]">{lang === 'en' ? 'bKash' : 'বিকাশ'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Nagad')}
                        className={`border rounded-xl p-2.5 text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          paymentMethod === 'Nagad'
                            ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold'
                            : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                        }`}
                      >
                        <span className="text-xs text-orange-600 font-bold">Nagad</span>
                        <span className="text-[9px]">{lang === 'en' ? 'Nagad' : 'নগদ'}</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod !== 'Cash on Delivery' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed font-sans">
                      {t('checkout_bkash_desc', lang)}
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutFormActive(false)}
                      className="w-1/3 bg-neutral-100 text-neutral-700 border border-neutral-200 font-bold py-2.5 rounded-xl text-xs hover:bg-neutral-200 cursor-pointer"
                    >
                      {t('checkout_back', lang)}
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-indigo-700 shadow-md transition-colors cursor-pointer"
                    >
                      {t('checkout_confirm', lang)}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Total Footer Area */}
            {cart.length > 0 && (
              <div className="p-4 bg-neutral-50 border-t border-neutral-100 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>{t('cart_subtotal', lang)}</span>
                    <span className="font-semibold text-neutral-700">{formatPrice(subTotal, lang)}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between text-xs text-rose-500">
                      <span>{t('cart_savings', lang)}</span>
                      <span className="font-semibold">-{formatPrice(totalSavings, lang)}</span>
                    </div>
                  )}

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                      <span>{t('cart_promo_discount', lang)}</span>
                      <span>-{formatPrice(appliedDiscount, lang)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>{t('cart_delivery_charge', lang)}</span>
                    <span>
                      {deliveryCharge === 0 ? (
                        <span className="text-emerald-600 font-bold">{t('cart_delivery_free', lang)}</span>
                      ) : (
                        formatPrice(deliveryCharge, lang)
                      )}
                    </span>
                  </div>

                  <hr className="border-neutral-200" />

                  <div className="flex justify-between items-center text-sm font-extrabold text-neutral-800">
                    <span>{t('cart_grand_total', lang)}</span>
                    <span className="text-lg text-indigo-600">{formatPrice(grandTotal, lang)}</span>
                  </div>
                </div>

                {/* Checkout Trigger button */}
                {!isCheckoutFormActive ? (
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        onRequireAuth();
                      } else {
                        setIsCheckoutFormActive(true);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all tracking-wider text-sm cursor-pointer"
                  >
                    <span>{t('cart_checkout_button', lang)}</span>
                  </button>
                ) : null}

                <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('cart_checkout_guarantee', lang)}</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
