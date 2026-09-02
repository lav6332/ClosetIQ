import React, { useState, useEffect } from 'react';
import { ClothingItem } from './types/wardrobe';
import {
  getWardrobeItems,
  saveWardrobeItem,
  deleteWardrobeItem,
  seedSampleWardrobe,
  incrementWearCount,
  toggleFavorite
} from './services/db';
import { Navbar } from './components/Navbar';
import { WardrobeGrid } from './components/WardrobeGrid';
import { SeasonalCollections } from './components/SeasonalCollections';
import { AddDressModal } from './components/AddDressModal';
import { DressDetailModal } from './components/DressDetailModal';
import { OutfitGenerator } from './components/OutfitGenerator';
import { ShoppingAdvisor } from './components/ShoppingAdvisor';

export function App() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gallery' | 'collections' | 'generator' | 'analytics'>('gallery');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load Wardrobe Items from IndexedDB on startup
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getWardrobeItems();
      setItems(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Handlers
  const handleSaveItem = async (newItem: ClothingItem) => {
    const updated = await saveWardrobeItem(newItem);
    setItems(updated);
  };

  const handleDeleteItem = async (id: string) => {
    const updated = await deleteWardrobeItem(id);
    setItems(updated);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleToggleFavorite = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = await toggleFavorite(id);
    setItems(updated);
    if (selectedItem?.id === id) {
      setSelectedItem(updated.find(i => i.id === id) || null);
    }
  };

  const handleIncrementWear = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = await incrementWearCount(id);
    setItems(updated);
    if (selectedItem?.id === id) {
      setSelectedItem(updated.find(i => i.id === id) || null);
    }
  };

  const handleResetSampleData = async () => {
    if (confirm('Reset wardrobe and reload curated sample clothes dataset?')) {
      setLoading(true);
      const samples = await seedSampleWardrobe();
      setItems(samples);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white transition-colors duration-300">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetSampleData={handleResetSampleData}
        totalItemsCount={items.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading your smart wardrobe...</p>
          </div>
        ) : (
          <>
            {activeTab === 'gallery' && (
              <WardrobeGrid
                items={items}
                onSelectItem={(item) => setSelectedItem(item)}
                onToggleFavorite={handleToggleFavorite}
                onIncrementWear={handleIncrementWear}
                onDelete={handleDeleteItem}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onResetSampleData={handleResetSampleData}
              />
            )}

            {activeTab === 'collections' && (
              <SeasonalCollections
                items={items}
                onSelectItem={(item) => setSelectedItem(item)}
                onToggleFavorite={handleToggleFavorite}
                onIncrementWear={handleIncrementWear}
                onDelete={handleDeleteItem}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />
            )}

            {activeTab === 'generator' && (
              <OutfitGenerator
                items={items}
                onSelectClothingItem={(item) => setSelectedItem(item)}
                onIncrementWear={handleIncrementWear}
              />
            )}

            {activeTab === 'analytics' && (
              <ShoppingAdvisor
                items={items}
                onSelectClothingItem={(item) => setSelectedItem(item)}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1 font-medium">
            <span>ClosetIQ Smart Wardrobe</span> • <span>Never forget what clothes you own</span>
          </p>
          <p>Local IndexedDB Storage • 100% Private in Browser</p>
        </div>
      </footer>

      {/* Add Dress Modal */}
      <AddDressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveItem}
      />

      {/* Dress Detail Inspection Modal */}
      <DressDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onUpdate={handleSaveItem}
        onDelete={handleDeleteItem}
        onIncrementWear={handleIncrementWear}
      />

    </div>
  );
}

export default App;
