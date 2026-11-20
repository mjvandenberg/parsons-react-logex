import '../src/element';
import exercises from '../src/core/logex/data/equivalence/all';
import {
  exerciseFromUrl,
  loadPreferences,
  Preferences,
  savePreferences,
  urlWithExercise,
} from './preferences';

type Name = keyof typeof exercises;

const texts = {
  en: {
    title: 'Prove logical equivalence',
    exercise: 'Exercise',
    settings: 'Settings',
    close: 'Close',
    feedback: 'Feedback',
    instantFeedback: 'Live feedback',
    instantFeedbackHelp: 'Feedback on correctness is updated on every change in the solution.',
    onlyCorrect: 'Only highlight correct items',
    onlyCorrectHelp: 'Incorrect formulas and rewrite rules are not marked; only correct ones turn green.',
    scaffolding: 'Scaffolding',
    autoFill: 'Automatically fill in rewrite rules',
    autoFillHelp: 'The correct rewrite rule is filled in between two correctly placed formulas.',
    language: 'Language',
    events: 'Events (for researchers)',
  },
  nl: {
    title: 'Bewijs logische equivalentie',
    exercise: 'Opgave',
    settings: 'Instellingen',
    close: 'Sluiten',
    feedback: 'Feedback',
    instantFeedback: 'Directe feedback',
    instantFeedbackHelp: 'De feedback wordt bij elke wijziging in je oplossing bijgewerkt.',
    onlyCorrect: 'Alleen correcte onderdelen markeren',
    onlyCorrectHelp: 'Foute formules en herschrijfregels worden niet gemarkeerd; alleen correcte worden groen.',
    scaffolding: 'Ondersteuning',
    autoFill: 'Herschrijfregels automatisch invullen',
    autoFillHelp: 'Tussen twee goed geplaatste formules wordt de juiste herschrijfregel ingevuld.',
    language: 'Taal',
    events: 'Events (voor onderzoekers)',
  },
} as const;

const proof = document.querySelector('parsons-proof')!;
const select = document.querySelector<HTMLSelectElement>('#exercise')!;
const dialog = document.querySelector<HTMLDialogElement>('#settings')!;
const form = dialog.querySelector('form')!;
const log = document.querySelector('#log')!;
const names = Object.keys(exercises) as Name[];

let preferences: Preferences = loadPreferences();

const apply = () => {
  const { settings, lang } = preferences;
  proof.settings = settings;
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll<HTMLElement>('[data-text]')) {
    el.textContent = texts[lang][el.dataset.text as keyof (typeof texts)['en']];
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-label]')) {
    el.setAttribute('aria-label', texts[lang][el.dataset.label as keyof (typeof texts)['en']]);
  }
  document.title = texts[lang].title;
};

const fillForm = () => {
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
  field('instantFeedback').checked = preferences.settings.instantFeedback;
  field('onlyCorrect').checked = !preferences.settings.markInvalidItems;
  field('autoFillRewriteRules').checked = preferences.settings.autoFillRewriteRules;
  (form.elements.namedItem('lang') as RadioNodeList).value = preferences.lang;
};

const loadExercise = (name: Name) => {
  select.value = name;
  proof.exercise = exercises[name];
};

// ---- Exercise picker: the URL is the source of truth ----------------------

select.append(...names.map((name) => new Option(name)));
select.addEventListener('change', () => {
  history.pushState(null, '', urlWithExercise(new URL(location.href), select.value));
  loadExercise(select.value as Name);
});
window.addEventListener('popstate', () =>
  loadExercise(exerciseFromUrl(new URL(location.href), names) as Name)
);

// ---- Settings dialog ------------------------------------------------------

document.querySelector('#open-settings')!.addEventListener('click', () => {
  fillForm();
  dialog.showModal();
});
// Light dismiss for browsers without closedby="any".
dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
form.addEventListener('change', () => {
  const field = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).checked;
  preferences = {
    settings: {
      instantFeedback: field('instantFeedback'),
      markInvalidItems: !field('onlyCorrect'),
      autoFillRewriteRules: field('autoFillRewriteRules'),
    },
    lang: (form.elements.namedItem('lang') as RadioNodeList).value === 'nl' ? 'nl' : 'en',
  };
  savePreferences(preferences);
  apply();
});

// ---- Event log ------------------------------------------------------------

for (const type of ['parsons-change', 'parsons-solved', 'parsons-help']) {
  proof.addEventListener(type, (e) => {
    const { detail } = e as CustomEvent;
    const summary =
      type === 'parsons-help'
        ? detail.kind
        : `valid=${proof.isValid}, solution: ${detail.right.map((i: { text: string }) => i.text).join(' ⇔ ')}`;
    log.prepend(`${new Date().toLocaleTimeString()}  ${type}  ${summary}\n`);
  });
}

document.querySelector('#version')!.textContent = __COMMIT_SHA__;

apply();
loadExercise(exerciseFromUrl(new URL(location.href), names) as Name);
