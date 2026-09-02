import React from 'react';
import { Heart, Sparkles, Calendar, CheckCircle2, MoreVertical, Trash2, DollarSign, Waves } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClothingItem } from '../types/wardrobe';
import { OCCASIONS, getCategoryInfo } from '../constants/wardrobeConstants';

interface DressCardProps {
  item: ClothingItem;
  onSelect: (item: ClothingItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onIncrementWear: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const DressCard: React.FC<DressCardProps> = ({
  item,
  onSelect,
  onToggleFavorite,
  onIncrementWear,
  onDelete,
}) => {
  const categoryInfo = getCategoryInfo(item.category);

  // Calculate Cost-per-wear
  const costPerWear = item.costPrice && item.wearingCount > 0
    ? (item.costPrice / item.wearingCount).toFixed(2)
    : item.costPrice
    ? item.costPrice.toFixed(2)
    : null;

  const handleWearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { x, y },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899']
    });

    onIncrementWear(item.id, e);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Top Image Preview Box */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        <img
          src={item.imageData}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Category Tag */}
          <span className="pointer-events-auto px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
            <span>{categoryInfo.emoji}</span>
            <span>{categoryInfo.label}</span>
          </span>

          {/* Favorite Heart Button */}
          <button
            onClick={(e) => onToggleFavorite(item.id, e)}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              item.favorite
                ? 'bg-rose-500 text-white'
                : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-900/80'
            }`}
          >
            <Heart className={`w-4 h-4 ${item.favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Delete Quick Button (Hover reveal) */}
        <button
          onClick={(e) => onDelete(item.id, e)}
          title="Delete clothing item"
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-md"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Color Swatch & Cost-Per-Wear */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-medium">
            <span
              className="w-3 h-3 rounded-full border border-white/40 shadow-inner"
              style={{ backgroundColor: item.primaryColor }}
            />
            <span>{item.colorName}</span>
          </div>

          {costPerWear && (
            <div className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              ${costPerWear}/wear
            </div>
          )}
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {item.name}
          </h4>
          {item.brand && (
            <p className="text-xs text-slate-400 font-medium">{item.brand}</p>
          )}
        </div>

        {/* Occasion Tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.occasions.map((occId) => {
            const occ = OCCASIONS.find(o => o.id === occId);
            if (!occ) return null;
            return (
              <span
                key={occId}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border flex items-center gap-1 ${occ.badgeBg}`}
              >
                <span>{occ.emoji}</span>
                <span>{occ.label}</span>
              </span>
            );
          })}
        </div>

        {/* Footer Actions & Stats */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Worn {item.wearingCount} {item.wearingCount === 1 ? 'time' : 'times'}</span>
          </div>

          <button
            onClick={handleWearClick}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
            title="Click when you wear this dress today"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Wore Today
          </button>
        </div>
      </div>
    </div>
  );
};
