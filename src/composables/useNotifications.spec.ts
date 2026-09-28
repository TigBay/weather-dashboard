import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotifications } from './useNotifications';

vi.mock('quasar', () => ({
  Notify: {
    create: vi.fn(),
  },
  Dialog: {
    create: vi.fn(),
  },
}));

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes warn and fatal functions', () => {
    const { warn, fatal } = useNotifications();
    expect(typeof warn).toBe('function');
    expect(typeof fatal).toBe('function');
  });

  it('warn function accepts a message', () => {
    const { warn } = useNotifications();
    expect(() => warn('Test warning')).not.toThrow();
  });

  it('fatal function accepts a message', () => {
    const { fatal } = useNotifications();
    expect(() => fatal('Test error')).not.toThrow();
  });
});
