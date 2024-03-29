import { Language } from '../types';

export const rules = [
  'rule.logic.propositional.absorption',
  'rule.logic.propositional.assoc',
  'rule.logic.propositional.commutativity',
  'rule.logic.propositional.demorgan',
  'rule.logic.propositional.distribution',
  'rule.logic.propositional.doublenegation',
  'rule.logic.propositional.equivalence',
  'rule.logic.propositional.falsecomplement',
  'rule.logic.propositional.falseconjunction',
  'rule.logic.propositional.falsedisjunction',
  'rule.logic.propositional.nottrue',
  'rule.logic.propositional.idempotency',
  'rule.logic.propositional.implication',
  'rule.logic.propositional.truecomplement',
  'rule.logic.propositional.trueconjunction',
  'rule.logic.propositional.truedisjunction',
  'rule.logic.propositional.notfalse',
  'rule.logic.propositional.axiomatic.assumption',
] as const;

export type Rule = typeof rules[number];

export const ruleTranslations: Record<Language, Record<Rule, string>> = {
  en: {
    'rule.logic.propositional.absorption': 'Absorption',
    'rule.logic.propositional.assoc': 'Associativity',
    'rule.logic.propositional.commutativity': 'Commutativity',
    'rule.logic.propositional.demorgan': 'De Morgan',
    'rule.logic.propositional.distribution': 'Distribution',
    'rule.logic.propositional.doublenegation': 'Double negation',
    'rule.logic.propositional.equivalence': 'Equivalence definition',
    'rule.logic.propositional.falsecomplement': 'F-rule complement',
    'rule.logic.propositional.falseconjunction': 'F-rule conjunction',
    'rule.logic.propositional.falsedisjunction': 'F-rule disjunction',
    'rule.logic.propositional.nottrue': 'F-rule not T',
    'rule.logic.propositional.idempotency': 'Idempotency',
    'rule.logic.propositional.implication': 'Implication definition',
    'rule.logic.propositional.truecomplement': 'T-rule complement',
    'rule.logic.propositional.trueconjunction': 'T-rule conjunction',
    'rule.logic.propositional.truedisjunction': 'T-rule disjunction',
    'rule.logic.propositional.notfalse': 'T-rule not F',
    'rule.logic.propositional.axiomatic.assumption': 'Assumption'
  },
  nl: {
    'rule.logic.propositional.absorption': 'Absorptie',
    'rule.logic.propositional.assoc': 'Associativiteit',
    'rule.logic.propositional.commutativity': 'Commutativiteit',
    'rule.logic.propositional.demorgan': 'De Morgan',
    'rule.logic.propositional.distribution': 'Distributie',
    'rule.logic.propositional.doublenegation': 'Dubbele negatie',
    'rule.logic.propositional.equivalence': 'Equivalentie-eliminatie',
    'rule.logic.propositional.falsecomplement': 'F-regel complement',
    'rule.logic.propositional.falseconjunction': 'F-regel conjunctie',
    'rule.logic.propositional.falsedisjunction': 'F-regel disjunctie',
    'rule.logic.propositional.nottrue': 'F-regel niet T',
    'rule.logic.propositional.idempotency': 'Idempotentie',
    'rule.logic.propositional.implication': 'Implicatie-eliminatie',
    'rule.logic.propositional.truecomplement': 'T-regel complement',
    'rule.logic.propositional.trueconjunction': 'T-regel conjunctie',
    'rule.logic.propositional.truedisjunction': 'T-regel disjunctie',
    'rule.logic.propositional.notfalse': 'T-regel niet F',
    'rule.logic.propositional.axiomatic.assumption': 'Aanname'
  },
};
