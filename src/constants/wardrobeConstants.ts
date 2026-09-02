import { OccasionOption, CategoryOption, SeasonOption, OccasionId, CategoryId } from '../types/wardrobe';

export const OCCASIONS: OccasionOption[] = [
  {
    id: 'inside_home',
    label: 'Inside Home',
    emoji: '🏠',
    description: 'Comfy loungewear, chill tees, sweatpants & relaxed home clothes',
    colorBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    colorText: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'casual_outing',
    label: 'Casual Outing',
    emoji: '👟',
    description: 'Coffee dates, movie nights, shopping trips & everyday street style',
    colorBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    colorText: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  {
    id: 'party_wear',
    label: 'Party Wear',
    emoji: '🎉',
    description: 'Clubs, celebrations, evening bashes & glam dresses/shirts',
    colorBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    colorText: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
  {
    id: 'work_formal',
    label: 'Work / Formal',
    emoji: '💼',
    description: 'Office meetings, interviews, business events & formal attire',
    colorBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    colorText: 'text-slate-700 dark:text-slate-300',
    badgeBg: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
  },
  {
    id: 'gym_sports',
    label: 'Gym / Sports',
    emoji: '🏋️‍♂️',
    description: 'Workout gear, activewear, running shoes & athletic tops',
    colorBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    colorText: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  {
    id: 'date_night',
    label: 'Date Night',
    emoji: '🍷',
    description: 'Romantic dinners, rooftop drinks & charming outfits',
    colorBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    colorText: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  },
  {
    id: 'beach_vacation',
    label: 'Beach / Vacation',
    emoji: '🏖️',
    description: 'Resortwear, linen shirts, swimsuits & breezy vacation outfits',
    colorBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    colorText: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  },
  {
    id: 'traditional_festive',
    label: 'Festive / Traditional',
    emoji: '🥻',
    description: 'Ethnic wear, weddings, cultural celebrations & festive attire',
    colorBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    colorText: 'text-orange-600 dark:text-orange-400',
    badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  },
  {
    id: 'sleepwear',
    label: 'Sleepwear',
    emoji: '🛌',
    description: 'Pajamas, nightwear & cozy bedtime outfits',
    colorBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    colorText: 'text-indigo-600 dark:text-indigo-400',
    badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  }
];

export const CATEGORIES: CategoryOption[] = [
  { id: 'jeans', label: 'Jeans & Denim', emoji: '👖', description: 'Blue/black jeans, denim jackets & skirts' },
  { id: 'tshirt', label: 'T-Shirts & Tanks', emoji: '🎽', description: 'Graphic tees, basic cotton t-shirts & tank tops' },
  { id: 'top', label: 'Shirts & Blouses', emoji: '👕', description: 'Button-down shirts, polo shirts & formal tops' },
  { id: 'bottom', label: 'Pants & Trousers', emoji: '👖', description: 'Chinos, formal trousers & cargo pants' },
  { id: 'shorts_skirt', label: 'Shorts & Skirts', emoji: '🩳', description: 'Breezy summer shorts, denim shorts & skirts' },
  { id: 'sweater_hoodie', label: 'Sweaters & Hoodies', emoji: '🧥', description: 'Knit sweaters, hoodies, cardigans & pullovers' },
  { id: 'outerwear', label: 'Jackets & Coats', emoji: '🧥', description: 'Leather jackets, blazers, trench coats & parkas' },
  { id: 'dress_suit', label: 'Dresses & Suits', emoji: '👗', description: 'Full dresses, gowns, tuxedos & two-piece suits' },
  { id: 'footwear', label: 'Footwear & Boots', emoji: '👟', description: 'Sneakers, boots, formal shoes, sandals & heels' },
  { id: 'accessory', label: 'Accessories & Bags', emoji: '👜', description: 'Handbags, belts, hats, sunglasses & jewelry' },
];

// Relevant categories for Summer Collection ☀️
export const SUMMER_CATEGORY_IDS: CategoryId[] = [
  'tshirt',
  'shorts_skirt',
  'top',
  'dress_suit',
  'jeans',
  'footwear',
  'accessory',
];

// Relevant categories for Winter Collection ❄️
export const WINTER_CATEGORY_IDS: CategoryId[] = [
  'sweater_hoodie',
  'outerwear',
  'jeans',
  'bottom',
  'top',
  'dress_suit',
  'footwear',
  'accessory',
];

export const SEASONS: SeasonOption[] = [
  { id: 'all_season', label: 'All Season', emoji: '🌦️' },
  { id: 'summer', label: 'Summer Collection', emoji: '☀️' },
  { id: 'winter', label: 'Winter Collection', emoji: '❄️' },
  { id: 'monsoon', label: 'Monsoon', emoji: '🌧️' },
];

export const COMMON_COLORS = [
  { name: 'Black', hex: '#18181b' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Denim Blue', hex: '#0284c7' },
  { name: 'Beige / Cream', hex: '#d4b996' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Olive Green', hex: '#3f6212' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Grey', hex: '#64748b' },
  { name: 'Yellow / Gold', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Brown / Tan', hex: '#78350f' },
];

export const getOccasionInfo = (id: OccasionId) => {
  return OCCASIONS.find(o => o.id === id) || OCCASIONS[0];
};

export const getCategoryInfo = (id: string) => {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
};
