import React, { useState } from 'react';
import { X, Heart, Calendar, Sparkles, CheckCircle2, Tag, Shirt, Trash2, Edit3, Save } from 'lucide-react';
import { ClothingItem, OccasionId } from '../types/wardrobe';
import { OCCASIONS, getCategoryInfo } from '../constants/wardrobeConstants';
import confetti from 'canvas-confetti';

interface DressDetailModalProps {
  item: ClothingItem | null;
  onClose: () => void;
  onUpdate: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
  onIncrementWear: (id: string) => void;
}

export const DressDetailModal: React.FC<DressDetailModalProps> = ({
  item,
  onClose,
  onUpdate,
  onDelete,
  onIncrementWear,
}) => {
  if (!item) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedOccasions, setEditedOccasions] = useState<OccasionId[]>(item.occasions);
  const [editedBrand, setEditedBrand] = useState(item.brand || '');
  const [editedNotes, setEditedNotes] = useState(item.notes || '');

  const categoryInfo = getCategoryInfo(item.category);

  const toggleOccasion = (id: OccasionId) => {
    if (editedOccasions.includes(id)) {
      if (editedOccasions.length === 1) return;
      setEditedOccasions(editedOccasions.filter(o => o !== id));
    } else {
      setEditedOccasions([...editedOccasions, id]);
    }
  };

  const handleSaveEdit = () => {
    const updated: ClothingItem = {
      ...item,
      name: editedName.trim(),
      occasions: editedOccasions,
      brand: editedBrand.trim() || undefined,
      notes: editedNotes.trim() || undefined,
    };
    onUpdate(updated);
    setIsEditing(false);
  };

  const handleWearToday = () => {
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.6 }
    });
    onIncrementWear(item.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 transform transition-all">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">{categoryInfo.emoji}</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              {categoryInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Dress Tags"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Image View */}
          <div className="bg-slate-950 p-6 flex items-center justify-center relative min-h-[300px]">
            <img
              src={item.imageData}
              alt={item.name}
              className="max-h-[380px] w-auto object-contain rounded-2xl shadow-xl"
            />
            {item.favorite && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                <Heart className="w-3.5 h-3.5 fill-current" />
                Favorite
              </div>
            )}
          </div>

          {/* Right Details & Edit Form */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    {item.name}
                  </h2>
                  {item.brand && (
                    <p className="text-sm font-semibold text-slate-400 mt-0.5">{item.brand}</p>
                  )}
                </div>

                {/* Where to wear section */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Where Can You Wear This?
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.occasions.map(occId => {
                      const occ = OCCASIONS.find(o => o.id === occId);
                      if (!occ) return null;
                      return (
                        <div
                          key={occId}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${occ.badgeBg}`}
                        >
                          <span className="text-sm">{occ.emoji}</span>
                          <span>{occ.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Color & Specs Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">Color</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                        style={{ backgroundColor: item.primaryColor }}
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {item.colorName}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">Times Worn</span>
                    <p className="text-sm font-black text-brand-600 dark:text-brand-400 mt-0.5">
                      {item.wearingCount} times
                    </p>
                  </div>
                </div>

                {item.notes && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200/50 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-bold">Notes: </span> {item.notes}
                  </div>
                )}

                <div className="text-xs text-slate-400 space-y-1">
                  <p>Added: {item.dateAdded}</p>
                  {item.lastWornDate && <p>Last Worn: {item.lastWornDate}</p>}
                </div>
              </div>
            ) : (
              /* Edit View */
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Edit Dress Details & Occasions
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Name / Title
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Occasions (Where to wear)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-1">
                    {OCCASIONS.map(occ => {
                      const isSel = editedOccasions.includes(occ.id);
                      return (
                        <button
                          key={occ.id}
                          type="button"
                          onClick={() => toggleOccasion(occ.id)}
                          className={`p-1.5 rounded-lg text-xs font-semibold text-left border flex items-center gap-1 ${
                            isSel
                              ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500'
                              : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <span>{occ.emoji}</span>
                          <span className="truncate">{occ.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this dress from your wardrobe?')) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              <button
                onClick={handleWearToday}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Worn Today
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
