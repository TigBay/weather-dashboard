import {ref} from 'vue';
import { LocalStorage } from 'quasar';
import type { GeocodingResult } from '@/types/open-meteo';

const STORAGE_KEY = 'recent-searches';
const MAX_ENTRIES = 5;

export function useRecentSearches() {
    const recentSearches = ref<GeocodingResult[]>(
        LocalStorage.getItem<GeocodingResult[]>(STORAGE_KEY) ?? []
    );

    function addSearch(location: GeocodingResult): void {
        const filtered = recentSearches.value.filter((entry) => entry.id !== location.id);
        const updated = [location, ...filtered].slice(0, MAX_ENTRIES);

        recentSearches.value = updated;
        LocalStorage.set(STORAGE_KEY, updated);
    }

    return {recentSearches, addSearch};
}