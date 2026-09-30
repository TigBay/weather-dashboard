/**
 * Maps WMO weather interpretation codes (as used by Open-Meteo) to a label and
 * a Material icon. See https://open-meteo.com/en/docs for the code table.
 */
export interface WeatherCondition {
  label: string;
  icon: string;
}

const CONDITIONS: Record<number, WeatherCondition> = {
  0: { label: 'Clear sky', icon: 'wb_sunny' },
  1: { label: 'Mainly clear', icon: 'wb_sunny' },
  2: { label: 'Partly cloudy', icon: 'wb_cloudy' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'blur_on' },
  48: { label: 'Depositing rime fog', icon: 'blur_on' },
  51: { label: 'Light drizzle', icon: 'grain' },
  53: { label: 'Moderate drizzle', icon: 'grain' },
  55: { label: 'Dense drizzle', icon: 'grain' },
  56: { label: 'Light freezing drizzle', icon: 'grain' },
  57: { label: 'Dense freezing drizzle', icon: 'grain' },
  61: { label: 'Slight rain', icon: 'water_drop' },
  63: { label: 'Moderate rain', icon: 'water_drop' },
  65: { label: 'Heavy rain', icon: 'water_drop' },
  66: { label: 'Light freezing rain', icon: 'water_drop' },
  67: { label: 'Heavy freezing rain', icon: 'water_drop' },
  71: { label: 'Slight snow', icon: 'ac_unit' },
  73: { label: 'Moderate snow', icon: 'ac_unit' },
  75: { label: 'Heavy snow', icon: 'ac_unit' },
  77: { label: 'Snow grains', icon: 'ac_unit' },
  80: { label: 'Slight rain showers', icon: 'grain' },
  81: { label: 'Moderate rain showers', icon: 'grain' },
  82: { label: 'Violent rain showers', icon: 'grain' },
  85: { label: 'Slight snow showers', icon: 'ac_unit' },
  86: { label: 'Heavy snow showers', icon: 'ac_unit' },
  95: { label: 'Thunderstorm', icon: 'flash_on' },
  96: { label: 'Thunderstorm with slight hail', icon: 'flash_on' },
  99: { label: 'Thunderstorm with heavy hail', icon: 'flash_on' },
};

const UNKNOWN: WeatherCondition = { label: 'Unknown conditions', icon: 'help_outline' };

export function describeWeatherCode(code: number | undefined): WeatherCondition {
  if (code === undefined) return UNKNOWN;
  return CONDITIONS[code] ?? UNKNOWN;
}
