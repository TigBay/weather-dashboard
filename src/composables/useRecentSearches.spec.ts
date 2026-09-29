import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorage } from 'quasar';
import { useRecentSearches } from './useRecentSearches';
import type { GeocodingResult } from '@/types/open-meteo';

const STORAGE_KEY = 'recent-searches';

function location(id: number, name: string): GeocodingResult {
  return {
    id,
    name,
    latitude: 50 + id,
    longitude: 8 + id,
    country: 'Germany',
    country_code: 'DE',
    timezone: 'Europe/Berlin',
  };
}

describe('useRecentSearches', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    const { recentSearches } = useRecentSearches();
    expect(recentSearches.value).toHaveLength(0);
  });

  it('adds a search and persists it', () => {
    const { recentSearches, addSearch } = useRecentSearches();

    addSearch(location(1, 'Frankfurt'));

    expect(recentSearches.value).toHaveLength(1);
    expect(recentSearches.value[0]?.name).toBe('Frankfurt');
    expect(LocalStorage.getItem<GeocodingResult[]>(STORAGE_KEY)).toHaveLength(1);
  });

  it('puts the newest entry first', () => {
    const { recentSearches, addSearch } = useRecentSearches();

    addSearch(location(1, 'Frankfurt'));
    addSearch(location(2, 'Berlin'));

    expect(recentSearches.value.map((entry) => entry.name)).toEqual(['Berlin', 'Frankfurt']);
  });

  it('moves a repeated search to the front instead of duplicating it', () => {
    const { recentSearches, addSearch } = useRecentSearches();

    addSearch(location(1, 'Frankfurt'));
    addSearch(location(2, 'Berlin'));
    addSearch(location(1, 'Frankfurt'));

    expect(recentSearches.value).toHaveLength(2);
    expect(recentSearches.value.map((entry) => entry.name)).toEqual(['Frankfurt', 'Berlin']);
  });

  it('keeps at most five entries', () => {
    const { recentSearches, addSearch } = useRecentSearches();

    for (let id = 1; id <= 7; id++) {
      addSearch(location(id, `City ${id}`));
    }

    expect(recentSearches.value).toHaveLength(5);
    expect(recentSearches.value.map((entry) => entry.name)).toEqual([
      'City 7',
      'City 6',
      'City 5',
      'City 4',
      'City 3',
    ]);
  });

  it('restores entries persisted by an earlier session', () => {
    LocalStorage.set(STORAGE_KEY, [location(9, 'Hamburg')]);

    const { recentSearches } = useRecentSearches();

    expect(recentSearches.value).toHaveLength(1);
    expect(recentSearches.value[0]?.name).toBe('Hamburg');
  });
});
