import type { ForecastResponse, GeocodingResponse } from '@/types/open-meteo';

export function isValidForecast(data: unknown): data is ForecastResponse {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  const hasCoordinates =
    typeof obj.latitude === 'number' && typeof obj.longitude === 'number';

  const hasCurrent =
    typeof obj.current === 'object' &&
    obj.current !== null &&
    typeof (obj.current as Record<string, unknown>).temperature_2m === 'number';

  return hasCoordinates && hasCurrent;
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