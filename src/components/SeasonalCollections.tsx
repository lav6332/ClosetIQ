import React, { useState } from 'react';
import { Sun, Snowflake, Filter, Sparkles, Shirt, PlusCircle } from 'lucide-react';
import { ClothingItem, CategoryId, SeasonId } from '../types/wardrobe';
import { CATEGORIES, SUMMER_CATEGORY_IDS, WINTER_CATEGORY_IDS, getCategoryInfo } from '../constants/wardrobeConstants';
import { DressCard } from './DressCard';

interface SeasonalCollectionsProps {
  items: ClothingItem[];
  onSelectItem: (item: ClothingItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onIncrementWear: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onOpenAddModal: () => void;
}

export const SeasonalCollections: React.FC<SeasonalCollectionsProps> = ({
  items,
  onSelectItem,
  onToggleFavorite,
  onIncrementWear,
  onDelete,
  onOpenAddModal,
}) => {
  const [activeSeason, setActiveSeason] = useState<'summer' | 'winter'>('summer');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');

  // Filter clothes for current season
  const seasonalItems = items.filter(item => {
    const isSeasonMatch = item.season === activeSeason || item.season === 'all_season';
    if (!isSeasonMatch) return false;

    if (selectedCategory !== 'all') {
      return item.category === selectedCategory;
    }
    return true;
  });

  // Get relevant categories for active season
  const relevantCategoryIds = activeSeason === 'summer' ? SUMMER_CATEGORY_IDS : WINTER_CATEGORY_IDS;
  const relevantCategories = CATEGORIES.filter(c => relevantCategoryIds.includes(c.id));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className={`rounded-3xl p-8 text-white shadow-xl relative overflow-hidden transition-all duration-500 ${
        activeSeason === 'summer'
          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500'
          : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700'
      }`}>
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-md inline-flex items-center gap-1.5 mb-3">
            {activeSeason === 'summer' ? <Sun className="w-3.5 h-3.5" /> : <Snowflake className="w-3.5 h-3.5" />}
            Seasonal Wardrobe Hub
          </span>
          <h2 className="text-3xl font-black tracking-tight capitalize">
            {activeSeason === 'summer' ? 'Summer Collection ☀️' : 'Winter Collection ❄️'}
          </h2>
          <p className="text-white/90 text-sm mt-2 font-medium">
            {activeSeason === 'summer'
              ? 'Explore your breezy shorts, graphic tees, linen shirts, resortwear & summer sundresses.'
              : 'Browse your cozy sweaters, hoodies, denim jeans, heavy jackets & winter coats.'}
          </p>
        </div>
      </div>

      {/* Season Switcher & Category Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        
        {/* Season Mode Switch Buttons */}
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <button
            onClick={() => {
              setActiveSeason('summer');
              setSelectedCategory('all');
            }}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-md ${
              activeSeason === 'summer'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sun className="w-5 h-5" />
            Summer Collection ☀️
          </button>

          <button
            onClick={() => {
              setActiveSeason('winter');
              setSelectedCategory('all');
            }}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-md ${
              activeSeason === 'winter'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-cyan-500/25 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Snowflake className="w-5 h-5" />
            Winter Collection ❄️
          </button>
        </div>

        {/* INDIVIDUAL RELEVANT CATEGORY PILLS FOR THIS SEASON */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Categories in {activeSeason === 'summer' ? 'Summer' : 'Winter'} Wardrobe
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Show All Categories
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              All {activeSeason === 'summer' ? 'Summer' : 'Winter'} Items ✨
            </button>

            {relevantCategories.map(cat => {
              const count = items.filter(i => (i.season === activeSeason || i.season === 'all_season') && i.category === cat.id).length;
              const isSel = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                    isSel
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md scale-105'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSel ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid Results */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
          Showing <span className="text-slate-900 dark:text-slate-100">{seasonalItems.length}</span> clothes in {activeSeason === 'summer' ? 'Summer' : 'Winter'} collection
        </p>
      </div>

      {seasonalItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {seasonalItems.map(item => (
            <DressCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onToggleFavorite={onToggleFavorite}
              onIncrementWear={onIncrementWear}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto my-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            {activeSeason === 'summer' ? <Sun className="w-8 h-8" /> : <Snowflake className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No clothes found in this collection category
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add new clothes and select "{activeSeason === 'summer' ? 'Summer' : 'Winter'}" as the season!
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md hover:bg-brand-700 transition-all flex items-center justify-center gap-1.5 mx-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Add {activeSeason === 'summer' ? 'Summer' : 'Winter'} Dress
          </button>
        </div>
      )}

    </div>
  );
};
