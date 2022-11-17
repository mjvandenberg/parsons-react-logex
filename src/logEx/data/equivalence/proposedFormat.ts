export const exercise1 = {
  solution: [
    {
      text: '¬(p ∧ q) ∨ s ∨ ¬r',
    },
    {
      text: '¬(p ∧ q) ∨ ¬r ∨ s',
      rule: 'rule.logic.propositional.commutativity',
    },
    {
      text: '¬(p ∧ q) ∨ (r → s)',
      rule: 'rule.logic.propositional.implication',
    },
    {
      text: '(p ∧ q) → (r → s)',
      rule: 'rule.logic.propositional.implication',
    },
  ],
  distrators: [
    {
      fromText: '¬(p ∧ q) ∨ ¬r ∨ s',
      distractedText: '¬(p ∧ q) ∨ ¬r → ¬s',
      motivation: 'buggyrulename1',
    },
  ],
};
