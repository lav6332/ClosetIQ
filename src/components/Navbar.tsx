import React from 'react';
import { Shirt, PlusCircle, Sparkles, ShoppingBag, Sun, Moon, Database, Snowflake } from 'lucide-react';

interface NavbarProps {
  activeTab: 'gallery' | 'collections' | 'generator' | 'analytics';
  setActiveTab: (tab: 'gallery' | 'collections' | 'generator' | 'analytics') => void;
  onOpenAddModal: () => void;
  onResetSampleData: () => void;
  totalItemsCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onResetSampleData,
  totalItemsCount,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('gallery')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">
                  ClosetIQ
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {totalItemsCount} {totalItemsCount === 1 ? 'Dress' : 'Clothes'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Smart Dress Selector & Wardrobe Companion
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Shirt className="w-4 h-4" />
              My Wardrobe
            </button>

            <button
              onClick={() => setActiveTab('collections')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'collections'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              Collections ☀️❄️
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'generator'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              What to Wear
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Shopping Check
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Add Dress Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-brand-500/25 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Dress</span>
            </button>

            {/* Reload Sample Wardrobe */}
            <button
              onClick={onResetSampleData}
              title="Load Sample Wardrobe Data"
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Theme"
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'gallery' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500'
            }`}
          >
            <Shirt className="w-4 h-4" />
            Wardrobe
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'collections' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            Collections
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'generator' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            What to Wear
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'analytics' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Shopping Check
          </button>
        </div>
      </div>
    </header>
  );
};
