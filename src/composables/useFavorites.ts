import { computed, ref } from 'vue';
import type { GeocodingResult } from '@/types/open-meteo';

const STORAGE_KEY = 'weather_favorites';

function readFromStorage(): GeocodingResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as GeocodingResult[]) : [];
  } catch {
    return [];
  }
}

// Module-level state so every caller shares the same list: SearchForm toggles a
// favorite and FavoritesPage sees it without a reload.
const favorites = ref<GeocodingResult[]>(readFromStorage());

function saveFavorites(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value));
}

export function useFavorites() {
  function addFavorite(location: GeocodingResult): void {
    if (favorites.value.some((fav) => fav.id === location.id)) return;

    favorites.value.push(location);
    saveFavorites();
  }

  function removeFavorite(id: number): void {
    const index = favorites.value.findIndex((fav) => fav.id === id);
    if (index === -1) return;

    favorites.value.splice(index, 1);
    saveFavorites();
  }

  function isFavorite(id: number): boolean {
    return favorites.value.some((fav) => fav.id === id);
  }

  function findFavorite(id: number): GeocodingResult | undefined {
    return favorites.value.find((fav) => fav.id === id);
  }

  // Discards the in-memory list and re-reads localStorage.
  function reloadFavorites(): void {
    favorites.value = readFromStorage();
  }

  return {
    favorites: computed(() => favorites.value),
    addFavorite,
    removeFavorite,
    isFavorite,
    findFavorite,
    reloadFavorites,
  };
}
