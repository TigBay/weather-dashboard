import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useFavorites } from './useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts with empty favorites', () => {
    const { favorites } = useFavorites();
    expect(favorites.value).toHaveLength(0);
  });

  it('adds a favorite and persists to localStorage', () => {
    const { favorites, addFavorite } = useFavorites();
    const location = {
      id: 1,
      name: 'Frankfurt',
      latitude: 50.1109,
      longitude: 8.6821,
      country: 'Germany',
      country_code: 'DE',
      timezone: 'Europe/Berlin',
    };

    addFavorite(location);

    expect(favorites.value).toHaveLength(1);
    expect(favorites.value[0]).toEqual(location);
    expect(localStorage.getItem('weather_favorites')).toBe(
      JSON.stringify([location])
    );
  });

  it('does not add duplicate favorites', () => {
    const { favorites, addFavorite } = useFavorites();
    const location = {
      id: 1,
      name: 'Frankfurt',
      latitude: 50.1109,
      longitude: 8.6821,
      country: 'Germany',
      country_code: 'DE',
      timezone: 'Europe/Berlin',
    };

    addFavorite(location);
    addFavorite(location);

    expect(favorites.value).toHaveLength(1);
  });

  it('removes a favorite and updates localStorage', () => {
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const location = {
      id: 1,
      name: 'Frankfurt',
      latitude: 50.1109,
      longitude: 8.6821,
      country: 'Germany',
      country_code: 'DE',
      timezone: 'Europe/Berlin',
    };

    addFavorite(location);
    expect(favorites.value).toHaveLength(1);

    removeFavorite(1);
    expect(favorites.value).toHaveLength(0);
    expect(localStorage.getItem('weather_favorites')).toBe(JSON.stringify([]));
  });

  it('checks if location is favorite', () => {
    const { addFavorite, isFavorite } = useFavorites();
    const location = {
      id: 1,
      name: 'Frankfurt',
      latitude: 50.1109,
      longitude: 8.6821,
      country: 'Germany',
      country_code: 'DE',
      timezone: 'Europe/Berlin',
    };

    expect(isFavorite(1)).toBe(false);

    addFavorite(location);
    expect(isFavorite(1)).toBe(true);
  });

  it('loads persisted favorites from localStorage', () => {
    const location = {
      id: 1,
      name: 'Frankfurt',
      latitude: 50.1109,
      longitude: 8.6821,
      country: 'Germany',
      country_code: 'DE',
      timezone: 'Europe/Berlin',
    };

    localStorage.setItem('weather_favorites', JSON.stringify([location]));

    const { favorites } = useFavorites();
    expect(favorites.value).toHaveLength(1);
    expect(favorites.value[0]).toEqual(location);
  });

  it('handles corrupt localStorage gracefully', () => {
    localStorage.setItem('weather_favorites', 'invalid json');

    const { favorites } = useFavorites();
    expect(favorites.value).toHaveLength(0);
  });
});
