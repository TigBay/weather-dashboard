import { ref, computed } from 'vue';
import type { GeocodingResult } from '@/types/open-meteo';
import { mockGeocodingResults } from './mockData';

export function useGeocoding() {
  const results = ref<GeocodingResult[]>([]);
  const isLoading = ref(false);
  const noResult = ref(false);

  function searchLocation(name: string): void {
    isLoading.value = true;
    noResult.value = false;

    const key = name.trim().toLowerCase();
    const found = mockGeocodingResults[key];

    if (found && found.length > 0) {
      results.value = found;
    } else {
      results.value = [];
      noResult.value = true;
    }

    isLoading.value = false;
  }

  const hasResults = computed(() => results.value.length > 0);

  return { results, isLoading, noResult, hasResults, searchLocation };
}