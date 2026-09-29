import { describe, it, expect, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import ForecastDetailDialog from './ForecastDetailDialog.vue';
import type { ForecastResponse } from '@/types/open-meteo';

const forecast: ForecastResponse = {
  latitude: 50.1109,
  longitude: 8.6821,
  timezone: 'Europe/Berlin',
  current: {
    temperature_2m: 18.4,
    weather_code: 1,
    wind_speed_10m: 7.2,
    time: '2026-09-29T08:00',
  },
  daily: {
    time: ['2026-09-29', '2026-09-30'],
    temperature_2m_max: [21, 19],
    temperature_2m_min: [11, 9],
    weather_code: [1, 3],
    precipitation_sum: [0, 1.2],
  },
};

// QDialog teleports its content to document.body, so assertions read from there
// rather than from the wrapper.
let wrapper: VueWrapper | null = null;

function mountDialog(modelValue: boolean) {
  wrapper = mount(ForecastDetailDialog, {
    props: { modelValue, forecast },
    attachTo: document.body,
  });
  return wrapper;
}

describe('ForecastDetailDialog', () => {
  // Teleported content outlives the wrapper, so clear the body between tests.
  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    document.body.innerHTML = '';
  });

  it('stays closed while v-model is false', async () => {
    mountDialog(false);
    await flushPromises();

    expect(document.body.textContent).not.toContain('7-Day Forecast');
  });

  it('renders one row per forecast day when opened', async () => {
    mountDialog(true);
    await flushPromises();

    const text = document.body.textContent ?? '';
    expect(text).toContain('7-Day Forecast');
    expect(text).toContain('2026-09-29');
    expect(text).toContain('2026-09-30');
    expect(text).toContain('11° / 21°');
    expect(text).toContain('9° / 19°');
  });

  it('passes the close event through to v-model', async () => {
    const dialog = mountDialog(true);
    await flushPromises();

    // QDialog reports closing via update:modelValue; defineModel has to
    // forward that to the parent.
    dialog.findComponent({ name: 'QDialog' }).vm.$emit('update:modelValue', false);
    await flushPromises();

    expect(dialog.emitted('update:modelValue')?.at(-1)).toEqual([false]);
  });
});
