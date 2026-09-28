import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWeather } from './useWeather';

vi.mock('@/composables/useNotifications', () => ({
  useNotifications: () => ({ warn: vi.fn(), fatal: vi.fn() }),
}));

describe('useWeather', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('populates forecast with all required fields on a valid response', async () => {
    const mockResponse = {
      latitude: 50.1109,
      longitude: 8.6821,
      current: {
        temperature_2m: 18.5,
        weather_code: 1,
      },
      daily: {
        time: ['2026-09-25', '2026-09-26'],
        temperature_2m_max: [20, 21],
        temperature_2m_min: [12, 13],
      },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const { forecast, loadWeather } = useWeather();

    await loadWeather(50.1109, 8.6821);

    expect(forecast.value).not.toBeNull();
    expect(forecast.value?.latitude).toBe(50.1109);
    expect(forecast.value?.current?.temperature_2m).toBe(18.5);
    expect(forecast.value?.daily?.time).toHaveLength(2);
  });

  it('leaves forecast null when the response is missing required fields', async () => {
    const incompleteResponse = {
      latitude: 50.1109,
      longitude: 8.6821,
      // current is missing entirely -> should fail isValidForecast
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(incompleteResponse),
    } as Response);

    const { forecast, loadWeather } = useWeather();

    await loadWeather(50.1109, 8.6821);

    expect(forecast.value).toBeNull();
  });
});