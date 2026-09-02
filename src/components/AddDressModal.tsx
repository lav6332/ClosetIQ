import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Check, RefreshCw, Sparkles, Tag, Shirt, Layers, Calendar, Palette, DollarSign } from 'lucide-react';
import { ClothingItem, OccasionId, CategoryId, SeasonId } from '../types/wardrobe';
import { OCCASIONS, CATEGORIES, SEASONS, COMMON_COLORS } from '../constants/wardrobeConstants';

interface AddDressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ClothingItem) => void;
}

export const AddDressModal: React.FC<AddDressModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [imageData, setImageData] = useState<string>('');
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionId[]>(['casual_outing']);
  const [category, setCategory] = useState<CategoryId>('jeans');
  const [season, setSeason] = useState<SeasonId>('all_season');
  const [colorName, setColorName] = useState('Denim Blue');
  const [primaryColor, setPrimaryColor] = useState('#0284c7');
  const [brand, setBrand] = useState('');
  const [costPrice, setCostPrice] = useState<string>('');
  const [notes, setNotes] = useState('');
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Toggle Camera
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied or unavailable:', err);
      alert('Camera access failed. Please select an image file instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImageData(dataUrl);
      stopCamera();
    }
  };

  // Process uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setImageData(canvas.toDataURL('image/jpeg', 0.85));
        }
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleOccasion = (id: OccasionId) => {
    if (selectedOccasions.includes(id)) {
      if (selectedOccasions.length === 1) {
        alert('Please select at least one occasion tag!');
        return;
      }
      setSelectedOccasions(selectedOccasions.filter(o => o !== id));
    } else {
      setSelectedOccasions([...selectedOccasions, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageData) {
      alert('Please snap or upload a photo of your dress!');
      return;
    }

    if (!name.trim()) {
      alert('Please enter a name or short title for this clothing item!');
      return;
    }

    const priceNum = parseFloat(costPrice);

    const newItem: ClothingItem = {
      id: `dress-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      imageData,
      occasions: selectedOccasions,
      category,
      season,
      primaryColor,
      colorName,
      brand: brand.trim() || undefined,
      costPrice: !isNaN(priceNum) && priceNum > 0 ? priceNum : undefined,
      notes: notes.trim() || undefined,
      wearingCount: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'clean',
      favorite: false
    };

    onSave(newItem);
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add Clothing to Wardrobe</h3>
              <p className="text-xs text-slate-500">Snap a photo and tag where you can wear it!</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Photo Capture / Upload Box */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Photo of your Dress / Clothing Item *
            </label>

            {!imageData && !isCameraActive && (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex justify-center gap-4 mb-3">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm shadow-md hover:bg-brand-700 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    Snap Photo with Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image File
                  </button>
                </div>
                <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP files or webcam capture</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}

            {/* Live Camera View */}
            {isCameraActive && (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-4 flex gap-3">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold text-sm shadow-lg flex items-center gap-2 hover:bg-slate-100"
                  >
                    <Camera className="w-5 h-5 text-brand-600" />
                    Snap Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2.5 rounded-full bg-slate-800/80 text-white font-semibold text-sm backdrop-blur-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {imageData && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group max-h-64 flex justify-center bg-slate-950">
                <img src={imageData} alt="Dress preview" className="max-h-64 object-contain" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageData('')}
                    className="p-2 rounded-xl bg-slate-900/80 text-white hover:bg-rose-600 transition-colors backdrop-blur-md"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Title / Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Clothing Title / Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Slim Tapered Blue Jeans, Oversized Hoodie, Linen Summer Shorts"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Occasion Tags Selection (WHERE TO WEAR) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                Where can you wear this dress? (Multi-select) *
              </label>
              <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                {selectedOccasions.length} selected
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OCCASIONS.map((occ) => {
                const isSelected = selectedOccasions.includes(occ.id);
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => toggleOccasion(occ.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500 shadow-sm ring-1 ring-brand-500'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">{occ.emoji}</span>
                    <span className="truncate flex-1">{occ.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Season Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Suitable Season / Collection
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as SeasonId)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {SEASONS.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.emoji} {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Selection Swatches */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Primary Color
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {COMMON_COLORS.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    setColorName(c.name);
                    setPrimaryColor(c.hex);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    colorName === c.name
                      ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shadow-inner"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brand & Purchase Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Brand / Store (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Levi's, Zara, Nike, Uniqlo"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Purchase Price (Optional for Cost-per-wear)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 50"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full px-3.5 py-2 pl-7 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
              </div>
            </div>
          </div>

          {/* Extra Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Notes / Fitting (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Stretchy denim, dry clean only"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save to Wardrobe
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
