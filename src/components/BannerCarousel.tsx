import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Smartphone, Download, ShieldCheck } from 'lucide-react';
import { AnonoLogo } from './AnonoLogo';
import { BannerSlide } from '../types';

interface BannerCarouselProps {
  lang: 'en' | 'bn';
  slides: BannerSlide[];
  onBannerClick: (category: string, query: string) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function BannerCarousel({ lang, slides, onBannerClick, showToast }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  // If slide count decreases, make sure index doesn't go out of bounds
  useEffect(() => {
    if (currentIndex >= slides.length && slides.length > 0) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  // Auto-play interval control
  useEffect(() => {
    if (!isHovered && slides.length > 1) {
      autoPlayTimer.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
      }, 5000);
    }
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isHovered, slides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  const activeSlide = slides[currentIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 select-none">
      
      {/* 1. Main Banner Slide Deck (No blurry overlays, full colors, highly professional e-commerce layout) */}
      <div 
        id="banner-carousel-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onBannerClick(activeSlide.category, activeSlide.searchQuery || '')}
        className={`lg:col-span-3 h-[180px] xs:h-[210px] sm:h-[260px] md:h-[300px] lg:h-[320px] rounded-2xl ${activeSlide.bgPresetClass} ${activeSlide.textColor} shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-stretch transition-all duration-500 cursor-pointer border border-neutral-200/45 group`}
      >
        
        {activeSlide.id === '1' || activeSlide.isFullImage ? (

          <div className="absolute inset-0 w-full h-full bg-white">
            <img 
              src={activeSlide.imageUrl} 
              alt="ANONO Campaign Banner" 
              className="w-full h-full object-cover sm:object-fill md:object-stretch transition-transform duration-700 ease-out group-hover:scale-[1.005]"
              referrerPolicy="no-referrer"
            />
            {/* Covered original orange cartoon logo on image with customized modern premium AnonoLogo badge */}
            <div className="absolute top-[4.5%] left-[2%] md:top-[5.5%] md:left-[2.8%] flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full border border-orange-200/50 shadow-md backdrop-blur-xs scale-[0.65] xs:scale-[0.8] md:scale-100 origin-top-left z-20 transition-all">
              <AnonoLogo size={18} />
              <span className="text-[10px] font-extrabold tracking-widest text-[#0f172a] font-sans">
                ANONO
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full flex flex-row items-center justify-between">
            {/* Left Column: Premium Text Campaign Info (Occupies 56%-60% width) */}
            <div className="w-[56%] xs:w-[54%] sm:w-[55%] md:w-[58%] p-3.5 xs:p-4.5 sm:p-6 md:p-8 flex flex-col justify-center items-start z-10 text-left space-y-1.5 xs:space-y-2 md:space-y-3 pointer-events-none select-none">
              
              {/* Campaign Tag Badge */}
              <div className="inline-flex items-center gap-1 bg-orange-600 text-white py-0.5 px-2 xs:px-2.5 rounded-full shadow-sm scale-[0.8] xs:scale-95 md:scale-100 tracking-wider font-sans origin-left">
                <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                <span className="text-[8px] md:text-[10px] font-extrabold uppercase tracking-wider">
                  {activeSlide.badge[lang]}
                </span>
              </div>

              {/* Campaign Title (Legible Dark Indigo-Slate) */}
              <h2 className="text-[12px] xs:text-sm sm:text-base md:text-xl lg:text-2xl font-black tracking-tight text-slate-900 leading-tight font-sans max-w-[95%] drop-shadow-xs">
                {activeSlide.title[lang]}
              </h2>

              {/* Supporting Subtitle */}
              <p className="hidden xs:block text-[8px] sm:text-[10px] md:text-[11.5px] lg:text-xs font-semibold text-slate-600 leading-relaxed font-sans max-w-sm line-clamp-1 xs:line-clamp-none">
                {activeSlide.subtitle[lang]}
              </p>

              {/* Quick Info Block (Visible on sm and larger) */}
              <div className="hidden sm:flex items-center gap-2 pt-0.5">
                <span className="bg-slate-900/5 px-2 py-0.5 rounded text-[8px] md:text-[9.5px] text-slate-800 font-extrabold tracking-wider border border-slate-900/10 uppercase">
                  📦 {lang === 'en' ? 'FREE SHIP' : 'ফ্রি শিপিং'}
                </span>
                <span className="bg-orange-500/10 px-2 py-0.5 rounded text-[8px] md:text-[9.5px] text-orange-600 font-extrabold tracking-wider border border-orange-500/20 uppercase">
                  🏷️ {activeSlide.discountText[lang]}
                </span>
              </div>

              {/* Action Button */}
              <div className="pt-0.5 xs:pt-1 select-none pointer-events-auto">
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black px-2.5 py-1 xs:px-4 xs:py-1.5 md:py-2 rounded-full text-[7px] xs:text-[9px] md:text-[10px] flex items-center gap-1 shadow-md hover:from-orange-600 hover:to-orange-700 transition-all cursor-pointer uppercase tracking-wider">
                  <span>{lang === 'en' ? 'SHOP NOW' : 'শপ নাও'}</span>
                  <span className="w-2.5 h-2.5 xs:w-3.5 xs:h-3.5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[7px] xs:text-[9px]">➔</span>
                </button>
              </div>
            </div>

            {/* Right Column: High-End Spotlight Showcase Box (Occupies 40%-44% width) */}
            <div className="w-[44%] xs:w-[46%] sm:w-[45%] md:w-[42%] h-full flex items-center justify-center p-2.5 xs:p-3 sm:p-4 md:p-5 relative z-10">
              <div className="w-full h-full bg-white/95 rounded-xl sm:rounded-2xl border border-white/90 shadow-lg relative overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:shadow-xl group-hover:border-neutral-200/40">
                
                {/* Decorative spotlight radial gradient element behind image */}
                <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-br from-neutral-100 via-neutral-100 to-orange-500/5 blur-xl pointer-events-none" />
                
                {/* Responsive, uncropped product preview (Strictly using object-contain to avoid any vertical head/toe cutoff) */}
                <img 
                  src={activeSlide.imageUrl} 
                  alt={activeSlide.title[lang]} 
                  className="max-w-[85%] max-h-[85%] object-contain select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-transform duration-700 ease-out group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Top Left Logo Tag */}
            <div className="absolute top-[4.5%] left-[2%] md:top-[5.5%] md:left-[2.8%] flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full border border-orange-200/50 shadow-sm scale-[0.65] xs:scale-[0.8] md:scale-100 origin-top-left z-20">
              <AnonoLogo size={18} />
              <span className="text-[10px] font-extrabold tracking-widest text-[#0f172a] font-sans">
                ANONO
              </span>
            </div>

            {/* absolute Floating Corner Sale Discount badge */}
            <div className="absolute top-[4.5%] right-[2%] md:top-6 md:right-8 z-20 scale-[0.85] xs:scale-100">
              <div className={`w-8 h-8 xs:w-11 xs:h-11 sm:w-14 sm:h-14 md:w-[72px] md:h-[72px] rounded-full ${activeSlide.discountBg} flex flex-col items-center justify-center text-center p-0.5 shadow-xl border border-white/95 sm:border-2 transform group-hover:rotate-6 transition-all duration-300`}>
                <span className="text-[4px] xs:text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-widest leading-none block">
                  {lang === 'en' ? 'UP TO' : 'সর্বোচ্চ'}
                </span>
                <span className="text-[6px] xs:text-[8px] sm:text-[10px] md:text-xs font-black tracking-tighter leading-none py-0.5 block font-sans">
                  {activeSlide.discountText[lang]}
                </span>
                <span className="text-[4px] xs:text-[5px] sm:text-[6px] md:text-[7px] font-bold opacity-90 uppercase leading-none block">
                  {lang === 'en' ? 'OFF' : 'ছাড়'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Left Arrow Controller */}
        {slides.length > 1 && (
          <button 
            onClick={handlePrev}
            className="absolute left-1.5 xs:left-2.5 top-1/2 -translate-y-1/2 w-6 h-6 xs:w-8 xs:h-8 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all duration-200 z-30 cursor-pointer border border-neutral-200/50 hover:scale-110"
            aria-label="Previous Campaign slide"
          >
            <ChevronLeft className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
          </button>
        )}

        {/* Right Arrow Controller */}
        {slides.length > 1 && (
          <button 
            onClick={handleNext}
            className="absolute right-1.5 xs:right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 xs:w-8 xs:h-8 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all duration-200 z-30 cursor-pointer border border-neutral-200/50 hover:scale-110"
            aria-label="Next Campaign slide"
          >
            <ChevronRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
          </button>
        )}

        {/* Bottom Multi-Indicators Indicator Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30 bg-neutral-900/10 px-1.5 py-0.5 rounded-full backdrop-blur-xs scale-[0.75] xs:scale-100">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleDotClick(idx, e)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? 'w-4 bg-indigo-600' : 'w-1.5 bg-neutral-300/60 hover:bg-neutral-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>

      {/* 2. Side Mobile Application Promo Area (Vibrant design, no cloudy background blur overlays) */}
      <div 
        id="side-promo-app"
        className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-neutral-900 via-purple-950 to-indigo-950 text-white p-5 rounded-2xl border border-neutral-800/10 shadow-md relative overflow-hidden"
      >
        <div className="space-y-3.5 relative z-10 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/25 flex items-center justify-center border border-indigo-500/30">
              <Smartphone className="w-4.5 h-4.5 text-amber-300" />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                {lang === 'en' ? 'DOWNLOAD MOBILE APP' : 'ডাউনলোড অফিশিয়াল অ্যাপ'}
              </h4>
              <p className="text-[9px] text-neutral-300 font-semibold font-sans">
                {lang === 'en' ? '10% Cash Back Coupon Inside' : 'অ্যাপ কেনাকাটায় ৩ বছর ওয়ারেন্টি'}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-black tracking-tight text-white uppercase">
              {lang === 'en' ? 'Scan to Claim Instant Gift' : 'কিউআর স্ক্যান করে উপহার নিন'}
            </h3>
            <p className="text-[9px] text-neutral-300 font-sans leading-relaxed">
              {lang === 'en' 
                ? 'Get Free home delivery coupon and claim extra 10% cash back instantly.'
                : 'অননু কিউআর স্ক্যানার দিয়ে মোবাইল কোড স্ক্যান করে ফ্রি ডিল ও ভাউচার লাভ করুন।'}
            </p>
          </div>
        </div>

        {/* QR Code Graphic element */}
        <div className="pt-3 flex items-center gap-3 relative z-10">
          <div id="qr-code-holder" className="w-16 h-16 bg-white p-1 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-gray-50 rounded-lg flex flex-col justify-between p-1.5 border border-dashed border-indigo-600/20">
              <div className="flex justify-between">
                <div className="w-3.5 h-3.5 bg-neutral-900 rounded-xs" />
                <div className="w-3.5 h-3.5 bg-neutral-900 rounded-xs" />
              </div>
              <div className="flex justify-center my-0.5">
                <div className="text-[8px] font-extrabold text-neutral-900 tracking-tighter">ANONO</div>
              </div>
              <div className="flex justify-between items-end">
                <div className="w-3.5 h-3.5 bg-neutral-900 rounded-xs" />
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-xs" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <button 
              onClick={() => showToast(lang === 'en' ? 'Redirecting to App Store...' : 'অ্যাপ স্টোরে রিডাইরেক্ট করা হচ্ছে...', 'info')}
              className="bg-white/10 hover:bg-white/20 text-[9px] font-black py-1 px-2 rounded border border-white/10 flex items-center gap-1 text-white transition-all cursor-pointer w-full text-left"
            >
              <Download className="w-2.5 h-2.5 text-amber-300 flex-shrink-0" />
              <span>App Store (iOS)</span>
            </button>
            <button 
              onClick={() => showToast(lang === 'en' ? 'Redirecting to Play Store...' : 'গুগল প্লে স্টোরে রিডাইরেক্ট করা হচ্ছে...', 'info')}
              className="bg-white/10 hover:bg-white/20 text-[9px] font-black py-1 px-2 rounded border border-white/10 flex items-center gap-1 text-white transition-all cursor-pointer w-full text-left"
            >
              <Download className="w-2.5 h-2.5 text-amber-300 flex-shrink-0" />
              <span>Google Play Store</span>
            </button>
          </div>
        </div>

        {/* Safe trust seal footer */}
        <div className="pt-2 text-[8px] text-neutral-400 font-sans flex items-center gap-1 z-10">
          <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
          <span>{lang === 'en' ? 'Verified 100% Eco-Safe App Experience' : 'শতভাগ নিরাপদ ও অনুমোদিত ই-কমার্স'}</span>
        </div>
      </div>

    </div>
  );
}
