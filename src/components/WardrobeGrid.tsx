import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, Shirt, PlusCircle, ArrowUpDown, RefreshCw, X, Heart } from 'lucide-react';
import { ClothingItem, OccasionId, CategoryId, WardrobeFilter } from '../types/wardrobe';
import { OCCASIONS, CATEGORIES } from '../constants/wardrobeConstants';
import { DressCard } from './DressCard';

interface WardrobeGridProps {
  items: ClothingItem[];
  onSelectItem: (item: ClothingItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onIncrementWear: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onOpenAddModal: () => void;
  onResetSampleData: () => void;
}

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({
  items,
  onSelectItem,
  onToggleFavorite,
  onIncrementWear,
  onDelete,
  onOpenAddModal,
  onResetSampleData,
}) => {
  const [filter, setFilter] = useState<WardrobeFilter>({
    searchQuery: '',
    occasion: 'all',
    category: 'all',
    season: 'all',
    status: 'all',
    onlyFavorites: false,
    sortBy: 'dateAdded_desc',
  });

  // Computed Filtered List
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Occasion Filter
      if (filter.occasion !== 'all') {
        if (!item.occasions.includes(filter.occasion as OccasionId)) {
          return false;
        }
      }

      // Category Filter
      if (filter.category !== 'all') {
        if (item.category !== filter.category) return false;
      }

      // Search Query Filter
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(q);
        const colorMatch = item.colorName.toLowerCase().includes(q);
        const brandMatch = item.brand?.toLowerCase().includes(q);
        const notesMatch = item.notes?.toLowerCase().includes(q);
        if (!nameMatch && !colorMatch && !brandMatch && !notesMatch) {
          return false;
        }
      }

      // Favorites Only
      if (filter.onlyFavorites && !item.favorite) return false;

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'wearingCount_desc') {
        return b.wearingCount - a.wearingCount;
      }
      if (filter.sortBy === 'wearingCount_asc') {
        return a.wearingCount - b.wearingCount;
      }
      if (filter.sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      if (filter.sortBy === 'dateAdded_asc') {
        return a.dateAdded.localeCompare(b.dateAdded);
      }
      // Default: dateAdded_desc
      return b.dateAdded.localeCompare(a.dateAdded);
    });
  }, [items, filter]);

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        
        {/* Top Search Bar & Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search dress name, color (e.g. Navy, White), brand, or keywords..."
              value={filter.searchQuery}
              onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            />
            {filter.searchQuery && (
              <button
                onClick={() => setFilter({ ...filter, searchQuery: '' })}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value as CategoryId | 'all' })}
            className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="all">All Categories 👔</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={filter.sortBy}
            onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as WardrobeFilter['sortBy'] })}
            className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="dateAdded_desc">Recently Added</option>
            <option value="wearingCount_desc">Most Worn First 🔥</option>
            <option value="wearingCount_asc">Least Worn First (Forgotten Clothes) 💤</option>
            <option value="name_asc">Name (A - Z)</option>
          </select>

          {/* Favorites Filter Toggle */}
          <button
            onClick={() => setFilter({ ...filter, onlyFavorites: !filter.onlyFavorites })}
            className={`px-4 py-3 rounded-2xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              filter.onlyFavorites
                ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${filter.onlyFavorites ? 'fill-current' : ''}`} />
            Favorites
          </button>
        </div>

        {/* OCCASION QUICK FILTER PILLS (Where can I wear this?) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Filter by Occasion (Where to wear)
            </span>
            {filter.occasion !== 'all' && (
              <button
                onClick={() => setFilter({ ...filter, occasion: 'all' })}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Clear Occasion Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {/* All Occasions Pill */}
            <button
              onClick={() => setFilter({ ...filter, occasion: 'all' })}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                filter.occasion === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              All Occasions ✨
            </button>

            {/* Individual Occasions */}
            {OCCASIONS.map(occ => {
              const isActive = filter.occasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => setFilter({ ...filter, occasion: occ.id })}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                    isActive
                      ? `${occ.badgeBg} border-current shadow-md scale-105`
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span>{occ.emoji}</span>
                  <span>{occ.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid Results Bar */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
          Showing <span className="text-slate-900 dark:text-slate-100">{filteredItems.length}</span> {filteredItems.length === 1 ? 'clothing item' : 'clothing items'}
        </p>

        {filteredItems.length < items.length && (
          <button
            onClick={() => setFilter({
              searchQuery: '',
              occasion: 'all',
              category: 'all',
              season: 'all',
              status: 'all',
              onlyFavorites: false,
              sortBy: 'dateAdded_desc',
            })}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Clothes Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
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
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto my-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
            <Shirt className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No clothes found matching filters
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try resetting your search query or selecting a different occasion.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={onOpenAddModal}
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md hover:bg-brand-700 transition-all flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Dress
            </button>
            <button
              onClick={onResetSampleData}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-all"
            >
              Load Sample Wardrobe
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
