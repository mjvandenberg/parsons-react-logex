import { describe, expect, test } from 'vitest';
import {
  defaults,
  exerciseFromUrl,
  loadPreferences,
  savePreferences,
  urlWithExercise,
} from './preferences';

const memoryStorage = (initial: Record<string, string> = {}): Storage => {
  const data = new Map(Object.entries(initial));
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  };
};

describe('preferences', () => {
  test('defaults when nothing is stored', () => {
    expect(loadPreferences(memoryStorage())).toEqual(defaults);
  });

  test('round-trips through storage', () => {
    const storage = memoryStorage();
    const prefs = {
      settings: { instantFeedback: true, markInvalidItems: false, autoFillRewriteRules: true },
      lang: 'nl' as const,
    };
    savePreferences(prefs, storage);
    expect(loadPreferences(storage)).toEqual(prefs);
  });

  test('ignores malformed or partial data', () => {
    expect(loadPreferences(memoryStorage({ 'parsons-proof-demo': '{nope' }))).toEqual(defaults);
    const partial = memoryStorage({
      'parsons-proof-demo': JSON.stringify({ settings: { instantFeedback: true, markInvalidItems: 'x' }, lang: 'fr' }),
    });
    expect(loadPreferences(partial)).toEqual({
      settings: { ...defaults.settings, instantFeedback: true },
      lang: 'en',
    });
  });

  test('survives storage that throws', () => {
    const blocked = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    expect(loadPreferences(blocked)).toEqual(defaults);
    expect(() => savePreferences(defaults, blocked)).not.toThrow();
  });
});

describe('exercise in the URL', () => {
  const names = ['Exercise 1', 'Exercise 2'];

  test('reads a known exercise and falls back to the first', () => {
    expect(exerciseFromUrl(new URL('https://x.test/?exercise=Exercise+2'), names)).toBe('Exercise 2');
    expect(exerciseFromUrl(new URL('https://x.test/?exercise=Nope'), names)).toBe('Exercise 1');
    expect(exerciseFromUrl(new URL('https://x.test/'), names)).toBe('Exercise 1');
  });

  test('writes the exercise and keeps other parameters', () => {
    const url = urlWithExercise(new URL('https://x.test/demo/?a=1'), 'Exercise 2');
    expect(url.searchParams.get('exercise')).toBe('Exercise 2');
    expect(url.searchParams.get('a')).toBe('1');
    expect(url.pathname).toBe('/demo/');
  });
});
