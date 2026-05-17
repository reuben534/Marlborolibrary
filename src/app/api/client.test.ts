import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getApiBaseUrl } from './client';

describe('api client', () => {
  const originalEnv = { ...import.meta.env };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.assign(import.meta.env, originalEnv);
  });

  it('getApiBaseUrl uses VITE_API_URL when set', () => {
    import.meta.env.VITE_API_URL = 'http://api.example.com/';
    import.meta.env.PROD = false;
    expect(getApiBaseUrl()).toBe('http://api.example.com');
  });

  it('getApiBaseUrl defaults to localhost in development', () => {
    import.meta.env.VITE_API_URL = '';
    import.meta.env.PROD = false;
    expect(getApiBaseUrl()).toBe('http://localhost:5000');
  });

  it('getApiBaseUrl uses same origin in production', () => {
    import.meta.env.VITE_API_URL = '';
    import.meta.env.PROD = true;
    expect(getApiBaseUrl()).toBe('');
  });

});
