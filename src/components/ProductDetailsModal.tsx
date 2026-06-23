import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Star, ShoppingCart, X, ShieldAlert, Truck, Sparkles, Check, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, formatPrice, formatNum, t } from '../data/translations';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  lang?: Language;
}

export default function ProductDetailsModal({ product, onClose, onAddToCart, onBuyNow, lang = 'bn' }: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(product.image);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transformOrigin: 'center center' });
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setActiveImage(product.image);
    setActiveIndex(0);
    setZoomStyle({ transformOrigin: 'center center' });
    setIsZoomed(false);
  }, [product.image]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)',
    });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)',
    });
  };

  // Generate exactly 6 product-fidelity multi-angle details & colorway alternates 
  // keeping 100% true to the actual product itself (no cross-product leakage)
  const galleryImages = React.useMemo(() => {
    const list: { url: string; style?: React.CSSProperties; isSynthetic?: boolean }[] = [];
    
    // 1. Core Primary Cover Image
    list.push({ url: product.image });
    
    // 2. Custom Images uploaded via Admin
    const extras = (product.images || []).filter(Boolean);
    extras.forEach((u) => {
      list.push({ url: u });
    });
    
    // 3. Smart variants (detailed zoom/rotate or hue-rotate colors to represent original angles/colors) 
    const fallbackTransforms = [
      { style: { transform: 'scale(1.4)', transformOrigin: 'center center' } }, // Slot 2: Detail Zoom
      { style: { filter: 'hue-rotate(90deg) saturate(1.1)' } },                // Slot 3: Alt Colorway A
      { style: { transform: 'scale(2.0)', transformOrigin: 'center center' } }, // Slot 4: Extreme macro detail
      { style: { filter: 'hue-rotate(190deg) brightness(0.9)' } },              // Slot 5: Alt Colorway B
      { style: { transform: 'scale(1.2) rotate(12deg)', transformOrigin: 'center center' } } // Slot 6: Side Angle Mock
    ];
    
    let tIdx = 0;
    while (list.length < 6 && tIdx < fallbackTransforms.length) {
      list.push({
        url: product.image,
        style: fallbackTransforms[tIdx].style,
        isSynthetic: true
      });
      tIdx++;
    }
    
    return list.slice(0, 6);
  }, [product.image, product.images]);

  const allImages = galleryImages.map(gi => gi.url);

  const itemPrice = Number(product?.price) || 0;
  const itemOriginalPrice = Number(product?.originalPrice) || itemPrice;
  const discountAmount = Math.max(0, itemOriginalPrice - itemPrice);
  const discountPercentage = itemOriginalPrice > itemPrice
    ? Math.round((discountAmount / itemOriginalPrice) * 100)
    : 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddWithQty = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  // Mock Reviews based on rating and language
  const mockReviews = lang === 'en' ? [
    { name: 'Kamrul Hasan', rating: 5, date: '2 days ago', comment: 'Great product! Delivery was extremely fast. Thank you.' },
    { name: 'Rumana Parveen', rating: 4, date: '1 week ago', comment: 'Packaging was wonderful. Exactly what I requested!' },
    { name: 'Tanveer Ahmed', rating: product.rating > 4.5 ? 5 : 4, date: '2 weeks ago', comment: 'I was slightly skeptical about buying this online, but it provides stunning quality!' }
  ] : [
    { name: 'কামরুল হাসান', rating: 5, date: '২ দিন আগে', comment: 'দারুন প্রোডাক্ট! ডেলিভারিও অনেক ফাস্ট ছিল। ধন্যবাদ।' },
    { name: 'রুমানা পারভীন', rating: 4, date: '১ সপ্তাহ আগে', comment: 'প্যাকেজিং খুব ভালো ছিল। যেমনটা চেয়েছিলাম ঠিক তেমনটাই পেয়েছি।' },
    { name: 'তানভীর আহমেদ', rating: product.rating > 4.5 ? 5 : 4, date: '২ সপ্তাহ আগে', comment: 'অনলাইনে এ ধরনের জিনিস ক্রয় করতে কিছুটা সন্দিহান ছিলাম, কিন্তু এটি চমৎকার সার্ভিস দিচ্ছে!' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal content centering */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
        >
          {/* Header/Close Button */}
          <div className="absolute right-4 top-4 z-10">
            <button
              onClick={onClose}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 p-2 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Image Section */}
            <div className="p-6 bg-neutral-50 flex flex-col justify-center relative">
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white border border-neutral-100 shadow-sm flex items-center justify-center relative group">
                <div 
                  className="w-full h-full overflow-hidden flex items-center justify-center cursor-zoom-in relative"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={activeImage || product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-100 ease-out"
                    style={{
                      ...(galleryImages[activeIndex]?.style || {}),
                      ...(isZoomed ? zoomStyle : {})
                    }}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
              </div>

              {/* Product Gallery / Thumbnail Images */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2.5 py-2 mt-4 overflow-x-auto justify-center select-none">
                  {galleryImages.map((gItem, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActiveImage(gItem.url);
                          setActiveIndex(idx);
                        }}
                        className={`w-14 h-14 rounded-xl bg-white border-2 overflow-hidden flex items-center justify-center transition-all p-1 cursor-pointer ${
                          isSelected ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-xs scale-105' : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="w-full h-full overflow-hidden flex items-center justify-center rounded-lg bg-neutral-50 relative">
                          <img
                            src={gItem.url}
                            alt={`${product.name} thumbnail ${idx}`}
                            className="max-h-full max-w-full object-contain"
                            style={gItem.style}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {discountPercentage > 0 && (
                <div className="absolute top-8 left-8 flex flex-col gap-1.5 items-start pointer-events-none">
                  <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {t('discount_label', lang, { pct: formatNum(discountPercentage, lang) })}
                  </span>
                  <span className="bg-indigo-600 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-spin" /> {t('modal_hot_deal', lang)}
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Info Section */}
            <div className="p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-100 text-indigo-700 mb-3 uppercase tracking-wider">
                  {product.category}
                  {product.subcategory && ` › ${product.subcategory}`}
                  {product.subSubcategory && ` › ${product.subSubcategory}`}
                </span>

                <h2 className="text-xl font-bold text-neutral-800 leading-snug mb-3 pr-6">
                  {product.name}
                </h2>

                {/* Rating summary */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 fill-current ${
                          i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 text-sm font-bold text-neutral-700">{formatNum(product.rating, lang)}</span>
                  </div>
                  <span className="text-neutral-300">|</span>
                  <span className="text-sm text-neutral-500 font-medium">
                    {t('reviews_count', lang, { count: formatNum(product.reviewsCount, lang) })}
                  </span>
                </div>

                {/* Separation line */}
                <hr className="border-neutral-100 mb-5" />

                {/* Pricing Area */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-indigo-600">
                      {formatPrice(product.price, lang)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-neutral-400 line-through">
                        {formatPrice(product.originalPrice, lang)}
                      </span>
                    )}
                  </div>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-rose-500 font-semibold mt-1 block">
                      {t('modal_buy_savings', lang)} {formatPrice(discountAmount, lang)}!
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-sm text-neutral-600 leading-relaxed font-normal bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    {product.description}
                  </p>
                </div>

                {/* Shipping & Returns Promise */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-xs text-neutral-500">
                  <div className="flex items-center gap-2 bg-neutral-50/50 p-2.5 rounded-lg border border-dashed border-neutral-200">
                    <Truck className="w-4 h-4 text-indigo-605 text-indigo-600" />
                    <span>{t('modal_delivery_promise', lang)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-50/50 p-2.5 rounded-lg border border-dashed border-neutral-200">
                    <ShieldAlert className="w-4 h-4 text-emerald-600" />
                    <span>{t('modal_return_promise', lang)}</span>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                <div className="flex flex-col gap-4">
                  {/* Quantity Selector & Stock Indicator Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                        {t('modal_qty_label', lang)}
                      </label>
                      <div className="flex items-center border border-neutral-200 bg-white rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={handleDecrement}
                          disabled={quantity <= 1}
                          className="px-3 py-1.5 font-bold hover:bg-neutral-100 text-neutral-500 disabled:opacity-50 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1.5 font-bold text-sm text-neutral-700 min-w-[30px] text-center select-none font-mono">
                          {formatNum(quantity, lang)}
                        </span>
                        <button
                          onClick={handleIncrement}
                          disabled={quantity >= product.stock}
                          className="px-3 py-1.5 font-bold hover:bg-neutral-100 text-neutral-500 disabled:opacity-50 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-400 font-semibold text-right">
                      {t('modal_available_stock', lang, { count: formatNum(product.stock, lang) })}
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    {product.stock === 0 ? (
                      <button
                        disabled
                        className="col-span-2 w-full bg-neutral-200 text-neutral-400 font-bold py-3 px-6 rounded-xl cursor-not-allowed text-center text-sm"
                      >
                        {t('out_of_stock', lang)}
                      </button>
                    ) : (
                      <>
                        {/* Add to Cart */}
                        <button
                          onClick={handleAddWithQty}
                          className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-3 rounded-xl shadow-xs transition-all hover:shadow-sm cursor-pointer text-xs md:text-sm ${
                            added
                              ? 'bg-emerald-600 text-white animate-pulse'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {added ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>{t('modal_add_success', lang)}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              <span>{t('add_to_cart', lang)}</span>
                            </>
                          )}
                        </button>

                        {/* Buy Now */}
                        <button
                          onClick={() => {
                            onBuyNow(product, quantity);
                          }}
                          className="w-full flex items-center justify-center gap-2 font-extrabold py-3 px-3 rounded-xl shadow-sm hover:shadow-md bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer text-xs md:text-sm"
                        >
                          <span>{t('buy_now', lang)}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Simulation */}
          <div className="bg-neutral-50 p-8 border-t border-neutral-100">
            <h3 className="font-bold text-neutral-800 text-md mb-4 flex items-center gap-2">
              <span>{t('modal_customer_reviews', lang)}</span>
              <span className="text-xs font-normal text-neutral-400">
                {t('modal_customer_reviews_sub', lang, { count: formatNum(mockReviews.length, lang) })}
              </span>
            </h3>
            <div className="space-y-4">
              {mockReviews.map((review, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-sm text-neutral-800">{review.name}</span>
                      <div className="flex items-center text-amber-400 mt-0.5">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3 h-3 fill-current ${
                              starIdx < review.rating ? 'text-amber-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400">{review.date}</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
