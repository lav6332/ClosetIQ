import React, { useState } from 'react';
import { ShoppingBag, AlertTriangle, CheckCircle2, Search, Shirt, TrendingUp, Sparkles, BarChart2, Eye } from 'lucide-react';
import { ClothingItem, OccasionId } from '../types/wardrobe';
import { OCCASIONS, CATEGORIES, getCategoryInfo } from '../constants/wardrobeConstants';

interface ShoppingAdvisorProps {
  items: ClothingItem[];
  onSelectClothingItem: (item: ClothingItem) => void;
}

export const ShoppingAdvisor: React.FC<ShoppingAdvisorProps> = ({
  items,
  onSelectClothingItem,
}) => {
  const [storeQuery, setStoreQuery] = useState('');

  // 1. Calculate Occasion Breakdown
  const occasionStats = OCCASIONS.map(occ => {
    const count = items.filter(item => item.occasions.includes(occ.id)).length;
    const percentage = items.length > 0 ? Math.round((count / items.length) * 100) : 0;
    return { ...occ, count, percentage };
  });

  // 2. Identify Forgotten Clothes (Worn < 2 times or added > 30 days ago with 0 wears)
  const forgottenItems = items.filter(item => item.wearingCount <= 1);

  // 3. Category distribution & duplicates
  const categoryStats = CATEGORIES.map(cat => {
    const catItems = items.filter(i => i.category === cat.id);
    return {
      ...cat,
      count: catItems.length,
      items: catItems,
    };
  });

  // 4. In-Store Quick Checker Search Results
  const matchedStoreItems = storeQuery.trim()
    ? items.filter(i =>
        i.name.toLowerCase().includes(storeQuery.toLowerCase()) ||
        i.colorName.toLowerCase().includes(storeQuery.toLowerCase()) ||
        i.brand?.toLowerCase().includes(storeQuery.toLowerCase()) ||
        i.category.toLowerCase().includes(storeQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-md inline-flex items-center gap-1.5 mb-3">
            <ShoppingBag className="w-3.5 h-3.5" />
            Shopping Companion & Wardrobe Protection
          </span>
          <h2 className="text-3xl font-black tracking-tight">Shopping Reality Check</h2>
          <p className="text-white/80 text-sm mt-2 font-medium">
            Never waste money on duplicate clothes again! Check your existing wardrobe distribution before you go shopping or order online.
          </p>
        </div>
      </div>

      {/* QUICK IN-STORE SEARCH BOX */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 ring-2 ring-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Instant In-Store Wardrobe Lookup 🛍️
            </h3>
            <p className="text-xs text-slate-500">
              Standing at a store & about to buy something? Search below to check if you already own similar clothes!
            </p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Type item you're looking to buy (e.g., 'Black T-Shirt', 'Denim Jacket', 'Formal Shirt')..."
            value={storeQuery}
            onChange={(e) => setStoreQuery(e.target.value)}
            className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {storeQuery.trim() && (
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Found {matchedStoreItems.length} matching clothes in your closet:
            </p>

            {matchedStoreItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {matchedStoreItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectClothingItem(item)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all cursor-pointer"
                  >
                    <img src={item.imageData} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">{item.colorName} • Worn {item.wearingCount} times</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Good news! You don't own any items matching "{storeQuery}". This purchase might fill a real wardrobe gap!
              </div>
            )}
          </div>
        )}
      </div>

      {/* FORGOTTEN CLOTHES WARNING ALERT */}
      {forgottenItems.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-3xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                Forgotten Clothes Alert ({forgottenItems.length} items rarely worn)
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                You have clothes in your wardrobe that you've barely worn. Check these before buying new items!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {forgottenItems.slice(0, 4).map(item => (
              <div
                key={item.id}
                onClick={() => onSelectClothingItem(item)}
                className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 text-center cursor-pointer hover:scale-105 transition-all shadow-sm"
              >
                <img src={item.imageData} alt={item.name} className="w-full aspect-square rounded-xl object-cover mb-2" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{item.name}</h4>
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Worn {item.wearingCount} times</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OCCASION DISTRIBUTION BREAKDOWN */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Wardrobe Breakdown by Occasion
            </h3>
            <p className="text-xs text-slate-500">
              See what percentage of your clothes belong to Home, Parties, Work, etc.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {items.length} Total Items
          </span>
        </div>

        <div className="space-y-4">
          {occasionStats.map(occ => (
            <div key={occ.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <span className="text-base">{occ.emoji}</span>
                  <span>{occ.label}</span>
                </span>
                <span className="text-slate-500">
                  {occ.count} clothes ({occ.percentage}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${Math.max(occ.percentage, occ.count > 0 ? 5 : 0)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
