import { ref } from 'vue';
import { Loading } from 'quasar';
import { useNotifications } from '@/composables/useNotifications';
import type { ForecastResponse } from '@/types/open-meteo';
import { isValidForecast } from '@/types/guards';

export function useWeather() {
  const forecast = ref<ForecastResponse | null>(null);
  const isLoading = ref(false);
  const { fatal } = useNotifications();

  async function loadWeather(latitude: number, longitude: number) {
    isLoading.value = true;
    Loading.show();

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto`,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: unknown = await response.json();

      if (!isValidForecast(data)) {
        throw new Error('Forecast response is missing required fields.');
      }

      forecast.value = data;
    } catch {
      fatal('Weather data is currently unavailable. Please try again later.');
    } finally {
      isLoading.value = false;
      Loading.hide();
    }
  }

  return { forecast, isLoading, loadWeather };
}
