export type OccasionId = 
  | 'inside_home'
  | 'casual_outing'
  | 'party_wear'
  | 'work_formal'
  | 'gym_sports'
  | 'date_night'
  | 'beach_vacation'
  | 'traditional_festive'
  | 'sleepwear';

export interface OccasionOption {
  id: OccasionId;
  label: string;
  emoji: string;
  description: string;
  colorBg: string;
  colorText: string;
  badgeBg: string;
}

export type CategoryId = 
  | 'jeans'
  | 'tshirt'
  | 'top'
  | 'bottom'
  | 'shorts_skirt'
  | 'sweater_hoodie'
  | 'outerwear'
  | 'dress_suit'
  | 'footwear'
  | 'accessory';

export interface CategoryOption {
  id: CategoryId;
  label: string;
  emoji: string;
  description?: string;
}

export type SeasonId = 'all_season' | 'summer' | 'winter' | 'monsoon';

export interface SeasonOption {
  id: SeasonId;
  label: string;
  emoji: string;
}

export type ConditionStatus = 'clean' | 'in_laundry' | 'needs_iron' | 'archived';

export interface ClothingItem {
  id: string;
  name: string;
  imageData: string; // Base64 or Blob URL
  occasions: OccasionId[]; // Multi-select: Where can I wear this?
  category: CategoryId;
  season: SeasonId;
  primaryColor: string;
  colorName: string;
  brand?: string;
  costPrice?: number; // Price in currency ($ or ₹)
  notes?: string;
  wearingCount: number;
  lastWornDate?: string;
  dateAdded: string;
  status: ConditionStatus;
  favorite?: boolean;
}

export interface WardrobeFilter {
  searchQuery: string;
  occasion: OccasionId | 'all';
  category: CategoryId | 'all';
  season: SeasonId | 'all';
  status: ConditionStatus | 'all';
  onlyFavorites: boolean;
  sortBy: 'dateAdded_desc' | 'dateAdded_asc' | 'wearingCount_desc' | 'wearingCount_asc' | 'costPerWear_asc' | 'name_asc';
}

export interface GeneratedOutfit {
  id: string;
  occasion: OccasionId;
  title: string;
  top?: ClothingItem;
  bottom?: ClothingItem;
  dressOrSuit?: ClothingItem;
  outerwear?: ClothingItem;
  footwear?: ClothingItem;
  accessory?: ClothingItem;
  score: number;
}
