import { ref, computed } from 'vue';
import type { GeocodingResult } from '@/types/open-meteo';
import { isValidGeocodingResponse } from '@/types/guards';
import { useNotifications } from '@/composables/useNotifications';

export function useGeocoding() {
  const results = ref<GeocodingResult[]>([]);
  const isLoading = ref(false);
  const noResult = ref(false);
  const { warn, fatal } = useNotifications();

  const hasResults = computed(() => results.value.length > 0);

  async function searchLocation(name: string) {
    if (!name.trim()) return;

    isLoading.value = true;
    noResult.value = false;
    results.value = [];

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=en`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!isValidGeocodingResponse(data) || !data.results || data.results.length === 0) {
        noResult.value = true;
        warn(`No location found for "${name}".`);
        return;
      }

      results.value = data.results;
    } catch {
      fatal('The geocoding service is currently unavailable. Please try again later.');
    } finally {
      isLoading.value = false;
    }
  }

  return { results, isLoading, noResult, hasResults, searchLocation };
}