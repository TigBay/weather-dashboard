import type { ForecastResponse } from '@/types/open-meteo';

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