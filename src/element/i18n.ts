import { Rule, ruleTranslations } from '../core/logex/rules';
import { ExerciseDescription, Language, languages } from '../core/types';

type Content = (Node | string)[];

export type Messages = {
  source: string;
  target: string;
  valid: string;
  invalid: string;
  check: string;
  reset: string;
  help: string;
  hint: string;
  step: string;
  solve: string;
  selectRule: string;
  ruleLabel: string;
  or: string;
  add: string;
  remove: string;
  noHint: string;
  rule: (rule: string) => string;
  describe: (d: ExerciseDescription, formula: (text: string) => Node) => Content;
  hintText: (formula: Node, mentionCheck: boolean) => Content;
};

const rule = (language: Language) => (name: string) =>
  ruleTranslations[language][name as Rule] ?? name;

const en: Messages = {
  source: 'Drag from here',
  target: 'Construct your solution here',
  valid: 'Congratulations, your solution is valid!',
  invalid: 'Your solution is not yet valid',
  check: 'Check solution',
  reset: 'Reset',
  help: 'Help',
  hint: 'Hint',
  step: 'Complete one step',
  solve: 'Complete my exercise',
  selectRule: '-- Select rule --',
  ruleLabel: 'Rewrite rule',
  or: 'or',
  add: 'Add to solution',
  remove: 'Move back',
  noHint:
    "Sorry, no hint available. If you are stuck, use 'Help' to complete one step or the exercise.",
  rule: rule('en'),
  describe: ({ type, from, to }, f) =>
    type === 'equivalence'
      ? ['Prove ', f(from), ' is logically equivalent to ', f(to)]
      : ['Convert ', f(from), ` to ${type === 'cnv' ? 'conjunctive' : 'disjunctive'} normal form`],
  hintText: (formula, mentionCheck) => [
    'Hint: try to use the block with formula ',
    formula,
    ' somewhere in your solution.',
    mentionCheck ? ' You can click on Check solution to validate your solution.' : '',
  ],
};

const nl: Messages = {
  source: 'Sleep vanaf hier',
  target: 'Bouw hier je oplossing',
  valid: 'Gefeliciteerd, je oplossing is correct!',
  invalid: 'Je oplossing is nog niet correct',
  check: 'Controleer',
  reset: 'Opnieuw',
  help: 'Help',
  hint: 'Hint',
  step: 'Vul één stap in',
  solve: 'Maak mijn opgave af',
  selectRule: '-- Kies regel --',
  ruleLabel: 'Herschrijfregel',
  or: 'of',
  add: 'Voeg toe aan oplossing',
  remove: 'Terugzetten',
  noHint:
    "Sorry, er is geen hint beschikbaar. Kom je er niet uit, gebruik dan 'Help' om één stap of de hele opgave in te vullen.",
  rule: rule('nl'),
  describe: ({ type, from, to }, f) =>
    type === 'equivalence'
      ? ['Bewijs dat ', f(from), ' logisch equivalent is aan ', f(to)]
      : ['Herschrijf ', f(from), ` naar ${type === 'cnv' ? 'conjunctieve' : 'disjunctieve'} normaalvorm`],
  hintText: (formula, mentionCheck) => [
    'Hint: probeer het blok met formule ',
    formula,
    ' ergens in je oplossing te gebruiken.',
    mentionCheck ? ' Klik op Controleer om je oplossing te laten nakijken.' : '',
  ],
};

const messages: Record<Language, Messages> = { en, nl };

/** Messages for a BCP 47 tag such as "nl" or "en-GB"; falls back to English. */
export const messagesFor = (tag: string | null | undefined): Messages => {
  const language = (tag ?? '').slice(0, 2).toLowerCase();
  return (languages as readonly string[]).includes(language)
    ? messages[language as Language]
    : en;
};
