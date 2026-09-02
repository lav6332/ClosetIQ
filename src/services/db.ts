import { get, set, del, keys } from 'idb-keyval';
import { ClothingItem } from '../types/wardrobe';
import { SAMPLE_WARDROBE } from '../data/sampleWardrobe';

const WARDROBE_STORAGE_KEY = 'closetiq_wardrobe_items';
const FIRST_RUN_KEY = 'closetiq_has_seeded_v1';

export const getWardrobeItems = async (): Promise<ClothingItem[]> => {
  try {
    const items = await get<ClothingItem[]>(WARDROBE_STORAGE_KEY);
    if (!items || items.length === 0) {
      const hasSeeded = await get<boolean>(FIRST_RUN_KEY);
      if (!hasSeeded) {
        // Auto seed sample wardrobe on first run so the user gets a rich experience immediately!
        await seedSampleWardrobe();
        return SAMPLE_WARDROBE;
      }
      return [];
    }
    return items;
  } catch (error) {
    console.error('Failed to load wardrobe items from IndexedDB:', error);
    return [];
  }
};

export const saveWardrobeItem = async (newItem: ClothingItem): Promise<ClothingItem[]> => {
  const currentItems = await getWardrobeItems();
  const existingIndex = currentItems.findIndex(item => item.id === newItem.id);

  let updatedItems: ClothingItem[];
  if (existingIndex >= 0) {
    updatedItems = [...currentItems];
    updatedItems[existingIndex] = newItem;
  } else {
    updatedItems = [newItem, ...currentItems];
  }

  await set(WARDROBE_STORAGE_KEY, updatedItems);
  return updatedItems;
};

export const deleteWardrobeItem = async (id: string): Promise<ClothingItem[]> => {
  const currentItems = await getWardrobeItems();
  const updatedItems = currentItems.filter(item => item.id !== id);
  await set(WARDROBE_STORAGE_KEY, updatedItems);
  return updatedItems;
};

export const seedSampleWardrobe = async (): Promise<ClothingItem[]> => {
  await set(WARDROBE_STORAGE_KEY, SAMPLE_WARDROBE);
  await set(FIRST_RUN_KEY, true);
  return SAMPLE_WARDROBE;
};

export const clearWardrobe = async (): Promise<ClothingItem[]> => {
  await set(WARDROBE_STORAGE_KEY, []);
  return [];
};

export const incrementWearCount = async (id: string): Promise<ClothingItem[]> => {
  const currentItems = await getWardrobeItems();
  const today = new Date().toISOString().split('T')[0];
  const updated = currentItems.map(item => {
    if (item.id === id) {
      return {
        ...item,
        wearingCount: item.wearingCount + 1,
        lastWornDate: today,
      };
    }
    return item;
  });
  await set(WARDROBE_STORAGE_KEY, updated);
  return updated;
};

export const toggleFavorite = async (id: string): Promise<ClothingItem[]> => {
  const currentItems = await getWardrobeItems();
  const updated = currentItems.map(item => {
    if (item.id === id) {
      return { ...item, favorite: !item.favorite };
    }
    return item;
  });
  await set(WARDROBE_STORAGE_KEY, updated);
  return updated;
};
