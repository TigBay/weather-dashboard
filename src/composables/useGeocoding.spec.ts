import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGeocoding } from './useGeocoding';

vi.mock('@/composables/useNotifications', () => ({
  useNotifications: () => ({ warn: vi.fn(), fatal: vi.fn() }),
}));

describe('useGeocoding', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('sets results when the API returns a match', async () => {
    const mockResponse = {
      results: [
        {
          id: 1,
          name: 'Frankfurt',
          latitude: 50.1109,
          longitude: 8.6821,
          country: 'Germany',
          country_code: 'DE',
          timezone: 'Europe/Berlin',
        },
      ],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const { results, noResult, searchLocation } = useGeocoding();

    await searchLocation('Frankfurt');

    expect(results.value).toHaveLength(1);
    expect(results.value[0]!.name).toBe('Frankfurt');
    expect(noResult.value).toBe(false);
  });

  it('sets noResult to true when no location is found', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    } as Response);

    const { results, noResult, searchLocation } = useGeocoding();

    await searchLocation('Xyzabc123');

    expect(results.value).toHaveLength(0);
    expect(noResult.value).toBe(true);
  });
});