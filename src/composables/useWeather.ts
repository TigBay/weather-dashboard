import { ref } from 'vue';
import { Dialog, Loading } from 'quasar';
import type { ForecastResponse } from '@/types/open-meteo';
import { isValidForecast } from '@/types/guards';

export function useWeather() {
  const forecast = ref<ForecastResponse | null>(null);
  const isLoading = ref(false);

  async function loadWeather(latitude: number, longitude: number) {
    isLoading.value = true;
    Loading.show();

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
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
      Dialog.create({
        title: 'Error',
        message: 'Weather data is currently unavailable. Please try again later.',
        color: 'negative',
        ok: { color: 'negative', label: 'OK' },
      });
    } finally {
      isLoading.value = false;
      Loading.hide();
    }
  }

  return { forecast, isLoading, loadWeather };
}