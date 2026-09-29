import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { reactive } from 'vue';
import SearchForm from './SearchForm.vue';
import { useFavorites } from '@/composables/useFavorites';
import type { GeocodingResult } from '@/types/open-meteo';

const route = reactive<{ query: Record<string, string> }>({ query: {} });

vi.mock('vue-router', () => ({
  useRoute: () => route,
}));

vi.mock('@/composables/useNotifications', () => ({
  useNotifications: () => ({ warn: vi.fn(), fatal: vi.fn() }),
}));

const frankfurt: GeocodingResult = {
  id: 1,
  name: 'Frankfurt',
  latitude: 50.1109,
  longitude: 8.6821,
  country: 'Germany',
  country_code: 'DE',
  timezone: 'Europe/Berlin',
};

const geocodingResponse = { results: [frankfurt] };

const forecastResponse = {
  latitude: 50.1109,
  longitude: 8.6821,
  timezone: 'Europe/Berlin',
  current: { temperature_2m: 18.4, weather_code: 1, wind_speed_10m: 7.2, time: '2026-09-29T08:00' },
  daily: {
    time: ['2026-09-29'],
    temperature_2m_max: [21],
    temperature_2m_min: [11],
    weather_code: [1],
    precipitation_sum: [0],
  },
};

// The component talks to two endpoints; route by URL so order does not matter.
function stubFetch() {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(url.includes('geocoding-api') ? geocodingResponse : forecastResponse),
      } as Response)
    )
  );
}

let wrapper: VueWrapper | null = null;

function mountForm() {
  wrapper = mount(SearchForm, {
    global: {
      stubs: { WeatherMap: true, ForecastDetailDialog: true },
    },
  });
  return wrapper;
}

describe('SearchForm', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavorites().reloadFavorites();
    route.query = {};
    stubFetch();
  });

  // Mounted components keep watching route.query, so a leftover instance would
  // react to the next test's navigation.
  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('renders search results after submitting a term', async () => {
    const wrapper = mountForm();

    await wrapper.find('input').setValue('Frankfurt');
    await wrapper.find('input').trigger('keyup.enter');
    await flushPromises();

    expect(wrapper.text()).toContain('Frankfurt');
    expect(wrapper.text()).toContain('Germany');
  });

  it('does not search for a blank term', async () => {
    const wrapper = mountForm();

    await wrapper.find('input').setValue('   ');
    await wrapper.find('input').trigger('keyup.enter');
    await flushPromises();

    expect(fetch).not.toHaveBeenCalled();
  });

  it('toggles a favorite from the result list', async () => {
    const wrapper = mountForm();
    const { isFavorite } = useFavorites();

    await wrapper.find('input').setValue('Frankfurt');
    await wrapper.find('input').trigger('keyup.enter');
    await flushPromises();

    const heart = wrapper.find('[aria-label="Add Frankfurt to favorites"]');
    expect(heart.exists()).toBe(true);

    await heart.trigger('click');
    expect(isFavorite(frankfurt.id)).toBe(true);
    expect(JSON.parse(localStorage.getItem('weather_favorites') ?? '[]')).toHaveLength(1);

    await wrapper.find('[aria-label="Remove Frankfurt from favorites"]').trigger('click');
    expect(isFavorite(frankfurt.id)).toBe(false);
  });

  it('loads a saved favorite from the location query parameter', async () => {
    const { addFavorite } = useFavorites();
    addFavorite(frankfurt);

    route.query = { location: String(frankfurt.id) };
    const wrapper = mountForm();
    await flushPromises();

    expect(wrapper.text()).toContain('Frankfurt');
    expect(wrapper.text()).toContain('18.4');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('ignores a location query parameter that is not a saved favorite', async () => {
    route.query = { location: '999' };
    const wrapper = mountForm();
    await flushPromises();

    expect(fetch).not.toHaveBeenCalled();
    expect(wrapper.text()).not.toContain('18.4');
  });
});
