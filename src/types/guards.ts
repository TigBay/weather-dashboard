import type { ForecastResponse, GeocodingResponse } from '@/types/open-meteo';

export function isValidForecast(data: unknown): data is ForecastResponse {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  const hasCoordinates = typeof obj.latitude === 'number' && typeof obj.longitude === 'number';

  const current = obj.current as Record<string, unknown> | undefined;
  const hasCurrent =
    typeof current === 'object' &&
    current !== null &&
    typeof current.temperature_2m === 'number' &&
    typeof current.weather_code === 'number' &&
    typeof current.wind_speed_10m === 'number';

  const daily = obj.daily as Record<string, unknown> | undefined;
  const hasDaily =
    typeof daily === 'object' &&
    daily !== null &&
    Array.isArray(daily.time) &&
    Array.isArray(daily.temperature_2m_max) &&
    Array.isArray(daily.temperature_2m_min);

  return hasCoordinates && hasCurrent && hasDaily;
}

export function isValidGeocodingResponse(data: unknown): data is GeocodingResponse {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.results)) return false;

  return obj.results.every((result: unknown) => {
    if (typeof result !== 'object' || result === null) return false;
    const r = result as Record<string, unknown>;
    return (
      typeof r.id === 'number' &&
      typeof r.name === 'string' &&
      typeof r.latitude === 'number' &&
      typeof r.longitude === 'number' &&
      typeof r.country === 'string' &&
      typeof r.country_code === 'string' &&
      typeof r.timezone === 'string'
    );
  });
}
