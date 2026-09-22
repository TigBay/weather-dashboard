import type { GeocodingResult, ForecastResponse } from '@/types/open-meteo';

export const mockGeocodingResults: Record<string, GeocodingResult[]> = {
  frankfurt: [{
    id: 1, name: 'Frankfurt am Main', latitude: 50.1109, longitude: 8.6821,
    country: 'Germany', country_code: 'DE', timezone: 'Europe/Berlin', population: 753056,
  }],
  berlin: [{
    id: 2, name: 'Berlin', latitude: 52.52, longitude: 13.405,
    country: 'Germany', country_code: 'DE', timezone: 'Europe/Berlin', population: 3769000,
  }],
  rom: [{
    id: 3, name: 'Rom', latitude: 41.9028, longitude: 12.4964,
    country: 'Italy', country_code: 'IT', timezone: 'Europe/Rome', population: 2873000,
  }],
};

export const mockForecast: ForecastResponse = {
  latitude: 50.1109,
  longitude: 8.6821,
  timezone: 'Europe/Berlin',
  current: { temperature_2m: 18.5, weather_code: 2, wind_speed_10m: 12.3, time: '2026-09-22T14:00' },
  daily: {
    time: ['2026-09-22', '2026-09-23', '2026-09-24'],
    temperature_2m_max: [20, 19, 21],
    temperature_2m_min: [12, 11, 13],
    weather_code: [2, 3, 1],
    precipitation_sum: [0, 2.4, 0],
  },
};