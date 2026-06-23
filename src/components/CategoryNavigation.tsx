import React, { useState } from 'react';
import { NESTED_CATEGORIES, ParentCategory } from '../data/categoriesData';
import { 
  ChevronRight, 
  ChevronDown,
  Check, 
  Layers, 
  ArrowLeft, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';

interface CategoryNavigationProps {
  lang: 'en' | 'bn';
  onSelectFilter: (categoryMapped: string, textSearch: string) => void;
  selectedCategory: string;
  nestedCategories?: ParentCategory[];
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  lang,
  onSelectFilter,
  selectedCategory,
  nestedCategories = NESTED_CATEGORIES
}) => {
  // State to control drop-down expansion
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Store active parent and active subcategory states inside the opened dropdown
  const [activeParentId, setActiveParentId] = useState<string>('fashion_apparel');
  const [activeSubName, setActiveSubName] = useState<string>("Bags");

  // Mobile steps trace: 0 = Parent categories list, 1 = Subcategories list, 2 = Sub-subcategories list
  const [mobileStep, setMobileStep] = useState<number>(0);

  // Helper references
  const activeParent = nestedCategories.find(p => p.id === activeParentId) || nestedCategories[0];
  const activeSub = activeParent?.subcategories?.find(s => s.nameEn === activeSubName) || null;

  const hasSubs = activeParent && activeParent.subcategories && activeParent.subcategories.length > 0;
  const hasSubSubs = hasSubs && activeSub && activeSub.subSubcategories && activeSub.subSubcategories.length > 0;

  // Helper to remove serial numbers like "১. ", "11. " and parenthetical translations like " (Women's & Girls' Fashion)"
  const cleanCategoryText = (text: string): string => {
    if (!text) return '';
    // 1. Remove leading digits followed by dots, dashes or spaces
    let cleaned = text.replace(/^[০-৯\d]+[\.\s\-]+/g, '').trim();
    // 2. Remove any text enclosed in parentheses (helpful for removing bilingual titles in brackets)
    cleaned = cleaned.replace(/\s*\([^)]*\)/g, '').trim();
    return cleaned;
  };

  const handleSelect = (parent: ParentCategory, subName?: string, subSubName?: string) => {
    const searchQuery = subSubName || subName || '';
    onSelectFilter(parent.mappedCategory, searchQuery);
    // Auto collapse after a selection to deliver perfect SPA UX
    setIsOpen(false);
  };

  const handleParentHoverOrClick = (parentId: string) => {
    setActiveParentId(parentId);
    const parent = nestedCategories.find(p => p.id === parentId);
    if (parent && parent.subcategories.length > 0) {
      setActiveSubName(parent.subcategories[0].nameEn);
    } else {
      setActiveSubName('');
    }
  };

  return (
    <div 
      className="w-full font-sans relative" 
      id="category-navigation-container"
    >
      {/* 1. Sleek Simple Text Toggle Trigger (Highly Compact, w-fit size to fit text perfectly with minimal spacing) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-fit inline-flex items-center gap-2 p-2 px-3.5 bg-white border border-neutral-250 hover:border-neutral-400 rounded-xl shadow-xs transition-all hover:bg-neutral-50 cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
          <span className="text-[11px] font-extrabold uppercase text-neutral-800 tracking-wider">
            {lang === 'en' ? 'Categories' : 'ক্যাটাগরি'}
          </span>
          {selectedCategory && selectedCategory !== 'সব প্রোডাক্ট (All)' && (
            <span className="text-[9px] bg-neutral-100 text-neutral-800 font-extrabold px-1.5 py-0.5 rounded border border-neutral-200">
              {cleanCategoryText(selectedCategory)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={`p-0.5 rounded transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-3 h-3 text-neutral-600 stroke-[2.5]" />
          </div>
        </div>
      </button>

      {/* 2. Interactive Cascading Directory Panel Layout */}
      {isOpen && (
        <div className={`mt-2.5 bg-white rounded-3xl border border-neutral-300 shadow-xl overflow-hidden z-20 absolute top-full left-0 animate-in fade-in slide-in-from-top-2 duration-200 transition-all ${
          hasSubSubs ? 'w-full md:w-[780px] max-w-5xl' : hasSubs ? 'w-full md:w-[520px] max-w-2xl' : 'w-full md:w-[260px] max-w-xs'
        }`}>
          
          {/* Quick Filter Reset Controls */}
          <div className="p-3 px-5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
              {lang === 'en' ? 'Hierarchical Category Deck' : 'ক্যাটাগরি সমূহ'}
            </span>
            <button
              type="button"
              onClick={() => {
                onSelectFilter('সব প্রোডাক্ট (All)', '');
                setMobileStep(0);
                setIsOpen(false);
              }}
              className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Show All Products' : 'সব প্রোডাক্টস একসাথে'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* DESKTOP MODE: Interactive Multilevel Cascading Dropdown */}
          <div className="hidden md:flex min-h-[420px] w-full divide-x divide-neutral-200 bg-white">
            
            {/* Column 1: Parent categories (Level 1) - Navigated on hover */}
            <div className="w-[260px] bg-white py-3 overflow-y-auto max-h-[460px] shrink-0">
              <div className="space-y-0.5 px-2">
                {nestedCategories.map((parent) => {
                  const isActive = activeParentId === parent.id;
                  const isSelected = selectedCategory === parent.mappedCategory;

                  return (
                    <div
                      key={parent.id}
                      onMouseEnter={() => handleParentHoverOrClick(parent.id)}
                      onClick={() => {
                        handleParentHoverOrClick(parent.id);
                        onSelectFilter(parent.mappedCategory, '');
                      }}
                      className={`group flex items-center justify-between p-2.5 px-3.5 rounded-xl cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-neutral-100 text-neutral-900 font-extrabold border-l-4 border-indigo-600 pl-2.5' 
                          : 'hover:bg-neutral-50 text-neutral-700 hover:text-neutral-950 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {/* No icons here - just clean simple text as requested */}
                        <span className="text-xs leading-tight truncate">
                          {lang === 'en' ? cleanCategoryText(parent.nameEn) : cleanCategoryText(parent.nameBn)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {isSelected && (
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                            ✓
                          </span>
                        )}
                        {parent.subcategories.length > 0 && (
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                            isActive ? 'text-indigo-600 translate-x-1 font-bold' : 'text-neutral-400 group-hover:translate-x-0.5'
                          }`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Subcategories (Level 2) - Opened conditionally */}
            {hasSubs && (
              <div className="w-[260px] bg-neutral-50/40 py-3 overflow-y-auto max-h-[460px] shrink-0">
                <div className="space-y-0.5 px-2">
                  {activeParent.subcategories.map((sub, sIdx) => {
                    const isActive = activeSubName === sub.nameEn;
                    const hasSubSubs = sub.subSubcategories && sub.subSubcategories.length > 0;

                    return (
                      <div
                        key={sIdx}
                        onMouseEnter={() => setActiveSubName(sub.nameEn)}
                        onClick={() => {
                          setActiveSubName(sub.nameEn);
                          handleSelect(activeParent, sub.nameEn);
                        }}
                        className={`group flex items-center justify-between p-2.5 px-3.5 rounded-xl cursor-pointer transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                            : 'hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 font-bold'
                        }`}
                      >
                        <span className="text-xs leading-tight truncate">
                          {lang === 'en' ? cleanCategoryText(sub.nameEn) : cleanCategoryText(sub.nameBn)}
                        </span>

                        {hasSubSubs && (
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                            isActive ? 'text-white translate-x-1' : 'text-neutral-400 group-hover:translate-x-0.5'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Column 3: Sub-subcategories (Level 3) - Opened conditionally if sub-subcategories exist */}
            {hasSubSubs && (
              <div className="w-[260px] bg-white py-3 overflow-y-auto max-h-[460px] shrink-0">
                <div className="space-y-1 px-3">
                  {activeSub?.subSubcategories?.map((subsub, ssIdx) => (
                    <button
                      key={ssIdx}
                      type="button"
                      onClick={() => handleSelect(activeParent, activeSub.nameEn, subsub.nameEn)}
                      className="text-left w-full p-2.5 px-3.5 bg-neutral-50 hover:bg-neutral-100 hover:text-indigo-600 rounded-xl text-xs font-semibold text-neutral-800 transition-all flex items-center justify-between group cursor-pointer border border-neutral-100 hover:border-neutral-200"
                    >
                      <span className="truncate">
                        {lang === 'en' ? cleanCategoryText(subsub.nameEn) : cleanCategoryText(subsub.nameBn)}
                      </span>
                      <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 shrink-0 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>

          {/* MOBILE MODE: Steps View */}
          <div className="block md:hidden bg-neutral-50 min-h-[300px]">
            {/* Step 0: Main level */}
            {mobileStep === 0 && (
              <div className="divide-y divide-neutral-100 bg-white">
                {nestedCategories.map((parent) => (
                  <div 
                    key={parent.id}
                    onClick={() => {
                      setActiveParentId(parent.id);
                      const firstSub = parent.subcategories[0]?.nameEn || '';
                      setActiveSubName(firstSub);
                      setMobileStep(1);
                    }}
                    className="flex items-center justify-between p-3.5 px-4 cursor-pointer hover:bg-neutral-50"
                  >
                    <span className="text-xs font-bold text-neutral-800">
                      {lang === 'en' ? cleanCategoryText(parent.nameEn) : cleanCategoryText(parent.nameBn)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Subcategory level */}
            {mobileStep === 1 && (
              <div className="bg-neutral-50">
                <div className="flex items-center gap-2 p-3 bg-white border-b border-neutral-200">
                  <button 
                    onClick={() => setMobileStep(0)}
                    className="p-1 px-2.5 rounded-lg bg-neutral-100 text-neutral-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Back' : 'পেছনে'}</span>
                  </button>
                  <span className="text-xs font-black truncate text-neutral-900 flex-grow">
                    {lang === 'en' ? cleanCategoryText(activeParent.nameEn) : cleanCategoryText(activeParent.nameBn)}
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 bg-white">
                  {activeParent.subcategories.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      onClick={() => {
                        setActiveSubName(sub.nameEn);
                        if (sub.subSubcategories && sub.subSubcategories.length > 0) {
                          setMobileStep(2);
                        } else {
                          handleSelect(activeParent, sub.nameEn);
                        }
                      }}
                      className="flex items-center justify-between p-3.5 px-4 cursor-pointer hover:bg-neutral-50"
                    >
                      <span className="text-xs font-bold text-neutral-800">
                        {lang === 'en' ? cleanCategoryText(sub.nameEn) : cleanCategoryText(sub.nameBn)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-white">
                  <button
                    onClick={() => {
                      onSelectFilter(activeParent.mappedCategory, '');
                      setIsOpen(false);
                    }}
                    className="w-full py-3 text-center bg-indigo-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-md"
                  >
                    {lang === 'en' ? `View All ${cleanCategoryText(activeParent.nameEn)}` : `সব একসাথে দেখুন`}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Sub-subcategory level */}
            {mobileStep === 2 && activeSub && (
              <div className="bg-neutral-50 pb-4">
                <div className="flex items-center gap-2 p-3 bg-white border-b border-neutral-200">
                  <button 
                    onClick={() => setMobileStep(1)}
                    className="p-1 px-2.5 rounded-lg bg-neutral-100 text-neutral-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Back' : 'পেছনে'}</span>
                  </button>
                  <span className="text-xs font-black truncate text-neutral-900 flex-grow">
                    {lang === 'en' ? cleanCategoryText(activeSub.nameEn) : cleanCategoryText(activeSub.nameBn)}
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 bg-white">
                  {activeSub.subSubcategories?.map((subsub, ssIdx) => (
                    <div
                      key={ssIdx}
                      onClick={() => {
                        handleSelect(activeParent, activeSub.nameEn, subsub.nameEn);
                      }}
                      className="flex items-center justify-between p-3.5 px-4 cursor-pointer hover:bg-neutral-50"
                    >
                      <span className="text-xs font-bold text-neutral-800">
                        {lang === 'en' ? cleanCategoryText(subsub.nameEn) : cleanCategoryText(subsub.nameBn)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-white">
                  <button
                    onClick={() => {
                      handleSelect(activeParent, activeSub.nameEn);
                    }}
                    className="w-full py-3 text-center bg-neutral-900 text-white rounded-xl text-xs font-black cursor-pointer"
                  >
                    {lang === 'en' ? `View All ${cleanCategoryText(activeSub.nameEn)}` : `সব প্রোডাক্ট দেখুন`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* End of layout */}
        </div>
      )}
    </div>
  );
};
