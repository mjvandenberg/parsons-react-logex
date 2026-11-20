// Demo page preferences: settings, language and theme in localStorage, the
// chosen exercise in the URL (?exercise=…) so a link opens the same exercise.
import type { Settings } from '../src/element';

/** `system` follows the operating system's light or dark preference. */
export type Theme = 'system' | 'light' | 'dark';
export type Preferences = { settings: Settings; lang: 'en' | 'nl'; theme: Theme };

/** Also read by the inline script in index.html that sets the theme before first paint. */
export const KEY = 'parsons-proof-demo';

export const defaults: Preferences = {
  settings: { instantFeedback: false, markInvalidItems: true, autoFillRewriteRules: false },
  lang: 'en',
  theme: 'system',
};

const themes: readonly Theme[] = ['system', 'light', 'dark'];

/** Read preferences; anything missing, malformed or unavailable falls back to the defaults. */
export const loadPreferences = (storage: Storage | undefined = globalThis.localStorage): Preferences => {
  try {
    const stored = JSON.parse(storage?.getItem(KEY) ?? '{}') as Partial<Preferences>;
    const settings = { ...defaults.settings };
    for (const key of Object.keys(settings) as (keyof Settings)[]) {
      if (typeof stored.settings?.[key] === 'boolean') settings[key] = stored.settings[key];
    }
    return {
      settings,
      lang: stored.lang === 'nl' ? 'nl' : 'en',
      theme: themes.includes(stored.theme as Theme) ? (stored.theme as Theme) : 'system',
    };
  } catch {
    return structuredClone(defaults);
  }
};

export const savePreferences = (
  preferences: Preferences,
  storage: Storage | undefined = globalThis.localStorage
) => {
  try {
    storage?.setItem(KEY, JSON.stringify(preferences));
  } catch {
    // Private mode or blocked storage: preferences last for this visit only.
  }
};

export const exerciseFromUrl = (url: URL, names: string[]): string =>
  names.find((n) => n === url.searchParams.get('exercise')) ?? names[0];

export const urlWithExercise = (url: URL, name: string): URL => {
  const next = new URL(url);
  next.searchParams.set('exercise', name);
  return next;
};
