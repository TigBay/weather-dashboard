import { describe, it, expect } from 'vitest';
import { describeWeatherCode } from './weather-code';

describe('describeWeatherCode', () => {
  it('maps a known code to its label and icon', () => {
    expect(describeWeatherCode(0)).toEqual({ label: 'Clear sky', icon: 'wb_sunny' });
    expect(describeWeatherCode(95).label).toBe('Thunderstorm');
  });

  it('groups related codes onto the same icon', () => {
    expect(describeWeatherCode(71).icon).toBe('ac_unit');
    expect(describeWeatherCode(75).icon).toBe('ac_unit');
    expect(describeWeatherCode(86).icon).toBe('ac_unit');
  });

  it('falls back for an unmapped code', () => {
    expect(describeWeatherCode(12345)).toEqual({
      label: 'Unknown conditions',
      icon: 'help_outline',
    });
  });

  it('falls back when the code is undefined', () => {
    expect(describeWeatherCode(undefined).label).toBe('Unknown conditions');
  });
});
