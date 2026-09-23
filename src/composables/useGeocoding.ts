import { ref, computed } from 'vue';
import { Notify, Dialog } from 'quasar';
import type { GeocodingResult } from '@/types/open-meteo';

export function useGeocoding() {
  const results = ref<GeocodingResult[]>([]);
  const isLoading = ref(false);
  const noResult = ref(false);

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

      if (!data.results || data.results.length === 0) {
        noResult.value = true;
        Notify.create({
          type: 'warning',
          message: `No location found for "${name}".`,
          position: 'top',
        });
        return;
      }

      results.value = data.results as GeocodingResult[];
    } catch {
      Dialog.create({
        title: 'Error',
        message: 'The geocoding service is currently unavailable. Please try again later.',
        color: 'negative',
        ok: { color: 'negative', label: 'OK' },
      });
    } finally {
      isLoading.value = false;
    }
  }

  return { results, isLoading, noResult, hasResults, searchLocation };
}