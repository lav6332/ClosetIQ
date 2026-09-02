import React, { useState, useMemo } from 'react';
import { Sparkles, RefreshCw, Shirt, CheckCircle2, Heart, Calendar, Compass } from 'lucide-react';
import { ClothingItem, OccasionId, SeasonId, GeneratedOutfit } from '../types/wardrobe';
import { OCCASIONS, SEASONS, getOccasionInfo } from '../constants/wardrobeConstants';
import confetti from 'canvas-confetti';

interface OutfitGeneratorProps {
  items: ClothingItem[];
  onSelectClothingItem: (item: ClothingItem) => void;
  onIncrementWear: (id: string) => void;
}

export const OutfitGenerator: React.FC<OutfitGeneratorProps> = ({
  items,
  onSelectClothingItem,
  onIncrementWear,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionId>('casual_outing');
  const [selectedSeason, setSelectedSeason] = useState<SeasonId>('all_season');
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const occasionInfo = getOccasionInfo(selectedOccasion);

  // Generate Matching Outfit based on selected occasion and season
  const outfit = useMemo<GeneratedOutfit | null>(() => {
    // Filter clothes eligible for this occasion
    const occasionItems = items.filter(item => {
      const matchesOccasion = item.occasions.includes(selectedOccasion);
      const matchesSeason = selectedSeason === 'all_season' || item.season === 'all_season' || item.season === selectedSeason;
      return matchesOccasion && matchesSeason;
    });

    if (occasionItems.length === 0) return null;

    // Separate by category
    const tops = occasionItems.filter(i => i.category === 'top');
    const bottoms = occasionItems.filter(i => i.category === 'bottom');
    const dresses = occasionItems.filter(i => i.category === 'dress_suit');
    const outerwears = occasionItems.filter(i => i.category === 'outerwear');
    const footwears = occasionItems.filter(i => i.category === 'footwear');
    const accessories = occasionItems.filter(i => i.category === 'accessory');

    // Pick random items based on shuffleSeed
    const getRandom = <T,>(arr: T[]): T | undefined => {
      if (arr.length === 0) return undefined;
      const index = Math.floor((Math.random() + shuffleSeed * 0.137) * arr.length) % arr.length;
      return arr[index];
    };

    // Decide if full dress or Top+Bottom combo
    const useDress = dresses.length > 0 && (tops.length === 0 || Math.random() > 0.5);

    let pickedTop: ClothingItem | undefined;
    let pickedBottom: ClothingItem | undefined;
    let pickedDress: ClothingItem | undefined;

    if (useDress) {
      pickedDress = getRandom(dresses);
    } else {
      pickedTop = getRandom(tops);
      pickedBottom = getRandom(bottoms);
    }

    let pickedOuterwear = getRandom(outerwears);
    let pickedFootwear = getRandom(footwears);
    let pickedAccessory = getRandom(accessories);

    if (!pickedTop && !pickedBottom && !pickedDress && !pickedFootwear && !pickedOuterwear) {
      // Fallback: pick any item from occasionItems
      const fallbackItem = getRandom(occasionItems);
      if (!fallbackItem) return null;
      if (fallbackItem.category === 'top') pickedTop = fallbackItem;
      else if (fallbackItem.category === 'bottom') pickedBottom = fallbackItem;
      else if (fallbackItem.category === 'dress_suit') pickedDress = fallbackItem;
      else if (fallbackItem.category === 'outerwear') pickedOuterwear = fallbackItem;
      else if (fallbackItem.category === 'footwear') pickedFootwear = fallbackItem;
    }

    return {
      id: `outfit-${selectedOccasion}-${shuffleSeed}`,
      occasion: selectedOccasion,
      title: `${occasionInfo.emoji} ${occasionInfo.label} Outfit Combo`,
      top: pickedTop,
      bottom: pickedBottom,
      dressOrSuit: pickedDress,
      outerwear: pickedOuterwear,
      footwear: pickedFootwear,
      accessory: pickedAccessory,
      score: 95 + Math.floor(Math.random() * 5),
    };
  }, [items, selectedOccasion, selectedSeason, shuffleSeed]);

  const handleWearEntireOutfit = () => {
    if (!outfit) return;
    confetti({
      particleCount: 50,
      spread: 90,
      origin: { y: 0.5 }
    });

    // Increment wear for all pieces in outfit
    [outfit.top, outfit.bottom, outfit.dressOrSuit, outfit.outerwear, outfit.footwear, outfit.accessory]
      .filter((piece): piece is ClothingItem => Boolean(piece))
      .forEach(piece => onIncrementWear(piece.id));

    alert(`Awesome! Logged wearing this entire ${occasionInfo.label} outfit today! 🎉`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-md inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Styled Outfit Assistant
          </span>
          <h2 className="text-3xl font-black tracking-tight">What Should I Wear Today?</h2>
          <p className="text-white/80 text-sm mt-2 font-medium">
            Stop staring at your closet! Select your occasion and weather below, and ClosetIQ will instantly generate a stylish outfit combination from your actual clothes.
          </p>
        </div>
        {/* Background Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Selector Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Select Occasion */}
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
            1. Select Where You Are Going / Occasion *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {OCCASIONS.map(occ => {
              const isSelected = selectedOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => {
                    setSelectedOccasion(occ.id);
                    setShuffleSeed(s => s + 1);
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-gradient-to-br from-brand-600 to-indigo-600 text-white border-transparent shadow-lg scale-105 ring-2 ring-brand-500/30'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">{occ.emoji}</span>
                  <span className="line-clamp-1">{occ.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Select Season & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase">Season:</span>
            <div className="flex gap-1.5 flex-1 sm:flex-initial">
              {SEASONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSeason(s.id);
                    setShuffleSeed(s => s + 1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedSeason === s.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShuffleSeed(s => s + 1)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Shuffle Outfit Combination 🎲
          </button>
        </div>

      </div>

      {/* Generated Outfit Result Display */}
      {outfit && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Outfit Header */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{occasionInfo.emoji}</span>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Recommended {occasionInfo.label} Look
                </h3>
                <p className="text-xs text-slate-500">Match score: {outfit.score}% match for your style</p>
              </div>
            </div>

            <button
              onClick={handleWearEntireOutfit}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Wear This Whole Outfit Today!
            </button>
          </div>

          {/* Grid of Clothing Pieces in Outfit */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Top */}
            {outfit.top && (
              <div
                onClick={() => onSelectClothingItem(outfit.top!)}
                className="group cursor-pointer bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-brand-500 transition-all p-3"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 mb-3">
                  <img src={outfit.top.imageData} alt={outfit.top.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Top / Shirt</span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{outfit.top.name}</h4>
                <p className="text-[11px] text-slate-400">{outfit.top.colorName}</p>
              </div>
            )}

            {/* Bottom */}
            {outfit.bottom && (
              <div
                onClick={() => onSelectClothingItem(outfit.bottom!)}
                className="group cursor-pointer bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-brand-500 transition-all p-3"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 mb-3">
                  <img src={outfit.bottom.imageData} alt={outfit.bottom.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Bottom / Pants</span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{outfit.bottom.name}</h4>
                <p className="text-[11px] text-slate-400">{outfit.bottom.colorName}</p>
              </div>
            )}

            {/* Dress or Suit */}
            {outfit.dressOrSuit && (
              <div
                onClick={() => onSelectClothingItem(outfit.dressOrSuit!)}
                className="group cursor-pointer bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-brand-500 transition-all p-3"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 mb-3">
                  <img src={outfit.dressOrSuit.imageData} alt={outfit.dressOrSuit.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Dress / Suit</span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{outfit.dressOrSuit.name}</h4>
                <p className="text-[11px] text-slate-400">{outfit.dressOrSuit.colorName}</p>
              </div>
            )}

            {/* Outerwear */}
            {outfit.outerwear && (
              <div
                onClick={() => onSelectClothingItem(outfit.outerwear!)}
                className="group cursor-pointer bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-brand-500 transition-all p-3"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 mb-3">
                  <img src={outfit.outerwear.imageData} alt={outfit.outerwear.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Jacket / Outerwear</span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{outfit.outerwear.name}</h4>
                <p className="text-[11px] text-slate-400">{outfit.outerwear.colorName}</p>
              </div>
            )}

            {/* Footwear */}
            {outfit.footwear && (
              <div
                onClick={() => onSelectClothingItem(outfit.footwear!)}
                className="group cursor-pointer bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-brand-500 transition-all p-3"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 mb-3">
                  <img src={outfit.footwear.imageData} alt={outfit.footwear.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Shoes / Footwear</span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{outfit.footwear.name}</h4>
                <p className="text-[11px] text-slate-400">{outfit.footwear.colorName}</p>
              </div>
            )}

          </div>
        </div>
      )}

      {!outfit && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No clothes found for {occasionInfo.label}
          </h3>
          <p className="text-xs text-slate-500">
            Add clothes tagged for "{occasionInfo.label}" to generate outfits!
          </p>
        </div>
      )}

    </div>
  );
};
