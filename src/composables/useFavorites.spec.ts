import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useFavorites } from './useFavorites';
import type { GeocodingResult } from '@/types/open-meteo';

const frankfurt: GeocodingResult = {
  id: 1,
  name: 'Frankfurt',
  latitude: 50.1109,
  longitude: 8.6821,
  country: 'Germany',
  country_code: 'DE',
  timezone: 'Europe/Berlin',
};

const berlin: GeocodingResult = {
  id: 2,
  name: 'Berlin',
  latitude: 52.52,
  longitude: 13.405,
  country: 'Germany',
  country_code: 'DE',
  timezone: 'Europe/Berlin',
};

describe('useFavorites', () => {
  // State lives at module level, so it has to be reset between tests.
  beforeEach(() => {
    localStorage.clear();
    useFavorites().reloadFavorites();
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

    addFavorite(frankfurt);

    expect(favorites.value).toHaveLength(1);
    expect(favorites.value[0]).toEqual(frankfurt);
    expect(localStorage.getItem('weather_favorites')).toBe(JSON.stringify([frankfurt]));
  });

  it('does not add duplicate favorites', () => {
    const { favorites, addFavorite } = useFavorites();

    addFavorite(frankfurt);
    addFavorite(frankfurt);

    expect(favorites.value).toHaveLength(1);
  });

  it('removes a favorite and updates localStorage', () => {
    const { favorites, addFavorite, removeFavorite } = useFavorites();

    addFavorite(frankfurt);
    expect(favorites.value).toHaveLength(1);

    removeFavorite(frankfurt.id);
    expect(favorites.value).toHaveLength(0);
    expect(localStorage.getItem('weather_favorites')).toBe(JSON.stringify([]));
  });

  it('ignores removal of an unknown id', () => {
    const { favorites, addFavorite, removeFavorite } = useFavorites();

    addFavorite(frankfurt);
    removeFavorite(999);

    expect(favorites.value).toHaveLength(1);
  });

  it('checks if location is favorite', () => {
    const { addFavorite, isFavorite } = useFavorites();

    expect(isFavorite(frankfurt.id)).toBe(false);

    addFavorite(frankfurt);
    expect(isFavorite(frankfurt.id)).toBe(true);
  });

  it('finds a favorite by id and returns undefined for unknown ids', () => {
    const { addFavorite, findFavorite } = useFavorites();

    addFavorite(frankfurt);

    expect(findFavorite(frankfurt.id)).toEqual(frankfurt);
    expect(findFavorite(berlin.id)).toBeUndefined();
  });

  it('shares state across separate calls', () => {
    const first = useFavorites();
    const second = useFavorites();

    first.addFavorite(frankfurt);

    expect(second.favorites.value).toHaveLength(1);
    expect(second.isFavorite(frankfurt.id)).toBe(true);
  });

  it('loads persisted favorites from localStorage', () => {
    localStorage.setItem('weather_favorites', JSON.stringify([frankfurt]));

    const { favorites, reloadFavorites } = useFavorites();
    reloadFavorites();

    expect(favorites.value).toHaveLength(1);
    expect(favorites.value[0]).toEqual(frankfurt);
  });

  it('handles corrupt localStorage gracefully', () => {
    localStorage.setItem('weather_favorites', 'invalid json');

    const { favorites, reloadFavorites } = useFavorites();
    reloadFavorites();

    expect(favorites.value).toHaveLength(0);
  });
});
