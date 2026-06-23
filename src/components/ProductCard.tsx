import { Product } from '../types';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, formatPrice, formatNum, t } from '../data/translations';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  lang?: Language;
}

export default function ProductCard({ product, onAddToCart, onViewDetails, onBuyNow, lang = 'bn' }: ProductCardProps) {
  const itemPrice = Number(product?.price) || 0;
  const itemOriginalPrice = Number(product?.originalPrice) || itemPrice;
  const discountPercentage = itemOriginalPrice > itemPrice
    ? Math.round(((itemOriginalPrice - itemPrice) / itemOriginalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full relative"
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
          {t('discount_label', lang, { pct: formatNum(discountPercentage, lang) })}
        </span>
      )}

      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80';
          }}
        />
        {/* Hover Quick View Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="bg-white/95 text-gray-900 p-2.5 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
            title="পণ্যটি দেখুন"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Category tag */}
        <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium tracking-wider mb-1 block truncate" title={`${product.category}${product.subcategory ? ` > ${product.subcategory}` : ''}${product.subSubcategory ? ` > ${product.subSubcategory}` : ''}`}>
          {product.category}
          {product.subcategory && ` › ${product.subcategory}`}
          {product.subSubcategory && ` › ${product.subSubcategory}`}
        </span>

        {/* Product Title */}
        <h3
          onClick={() => onViewDetails(product)}
          className="font-bold text-gray-800 text-[12px] sm:text-sm line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer flex-grow mb-2 leading-snug"
        >
          {product.name}
        </h3>

        {/* Ratings and Reviews */}
        <div className="flex items-center gap-1 sm:gap-1.5 mb-2.5 flex-wrap">
          <div className="flex items-center text-amber-400">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            <span className="text-[10px] sm:text-xs font-bold text-gray-700 ml-0.5">{formatNum(product.rating, lang)}</span>
          </div>
          <span className="text-gray-300 text-[10px] sm:text-xs">|</span>
          <span className="text-[10px] sm:text-xs text-gray-400 truncate max-w-[80px] xs:max-w-none">
            {t('reviews_count', lang, { count: formatNum(product.reviewsCount, lang) })}
          </span>
        </div>

        {/* Price and Stock info */}
        <div className="flex items-end justify-between mt-auto mb-3">
          <div>
            <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5">
              <span className="text-base sm:text-lg font-black text-indigo-600">
                {formatPrice(product.price, lang)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice, lang)}
                </span>
              )}
            </div>
            {product.stock <= 5 ? (
              <span className="text-[9px] sm:text-[10px] font-bold text-rose-500 animate-pulse block mt-0.5">
                {t('stock_low', lang, { count: formatNum(product.stock, lang) })}
              </span>
            ) : (
              <span className="text-[9px] sm:text-[10px] text-emerald-600 block mt-0.5">
                {t('stock_normal', lang, { count: formatNum(product.stock, lang) })}
              </span>
            )}
          </div>
        </div>

        {/* Action Button Row - Vertically stacked on small mobile view, inline on tablets/desktops */}
        <div className="flex flex-col sm:flex-row gap-1.5 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={product.stock === 0}
            className={`w-full sm:flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1.5 rounded-xl text-[10.5px] sm:text-[11px] font-extrabold border shadow-3xs transition-all hover:shadow-xs cursor-pointer ${
              product.stock === 0
                ? 'bg-neutral-150 text-neutral-400 border-none cursor-not-allowed'
                : 'bg-indigo-50/70 text-indigo-750 border-indigo-100 hover:bg-indigo-600 hover:text-white'
            }`}
            title={t('add_to_cart', lang)}
          >
            <ShoppingCart className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span>{t('add_to_cart', lang)}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product);
            }}
            disabled={product.stock === 0}
            className={`w-full sm:flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1.5 rounded-xl text-[10.5px] sm:text-[11px] font-extrabold shadow-3xs hover:shadow-xs transition-all cursor-pointer ${
              product.stock === 0
                ? 'bg-neutral-150 text-neutral-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-750 text-white'
            }`}
          >
            <span>{t('buy_now', lang)}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
