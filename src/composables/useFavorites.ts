import { ref, computed } from 'vue';
import type { GeocodingResult } from '@/types/open-meteo';

const STORAGE_KEY = 'weather_favorites';

export function useFavorites() {
  const favorites = ref<GeocodingResult[]>(loadFavorites());

  function loadFavorites(): GeocodingResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveFavorites() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value));
  }

  function addFavorite(location: GeocodingResult) {
    const exists = favorites.value.some((fav) => fav.id === location.id);
    if (!exists) {
      favorites.value.push(location);
      saveFavorites();
    }
  }

  function removeFavorite(id: number) {
    const index = favorites.value.findIndex((fav) => fav.id === id);
    if (index !== -1) {
      favorites.value.splice(index, 1);
      saveFavorites();
    }
  }

  function isFavorite(id: number): boolean {
    return favorites.value.some((fav) => fav.id === id);
  }

  return {
    favorites: computed(() => favorites.value),
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
