import { ref } from 'vue';
import type { ForecastResponse } from '@/types/open-meteo';
import { mockForecast } from './mockData';

export function useWeather() {
  const forecast = ref<ForecastResponse | null>(null);
  const isLoading = ref(false);
  const hasError = ref(false);

  function loadWeather(latitude: number, longitude: number): void {
    isLoading.value = true;
    hasError.value = false;

    forecast.value = { ...mockForecast, latitude, longitude };

    isLoading.value = false;
  }

  return { forecast, isLoading, hasError, loadWeather };
}