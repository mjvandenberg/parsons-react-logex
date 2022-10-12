import { Solution } from '../typesSolution';

export const logExSolutionResponse1: Solution = {
  derivation: {
    derivation: {
      context: {
        term: '(q ↔ F) ∧ q',
        environment: {},
        location: [],
      },
      derivationsteps: [
        {
          step: {
            rule: 'logic.propositional.defequiv',
            location: [0],
            environment: {},
          },
          context: {
            term: '((q ∧ F) ∨ (¬q ∧ ¬F)) ∧ q',
            environment: {},
            location: [0],
          },
        },
        {
          step: {
            rule: 'logic.propositional.falsezeroand',
            location: [0, 0],
            environment: {},
          },
          context: {
            term: '(F ∨ (¬q ∧ ¬F)) ∧ q',
            environment: {},
            location: [0, 0],
          },
        },
        {
          step: {
            rule: 'logic.propositional.falsezeroor',
            location: [0],
            environment: {},
          },
          context: {
            term: '(¬q ∧ ¬F) ∧ q',
            environment: {},
            location: [0],
          },
        },
        {
          step: {
            rule: 'logic.propositional.notfalse',
            location: [0, 1],
            environment: {},
          },
          context: {
            term: '(¬q ∧ T) ∧ q',
            environment: {},
            location: [0, 1],
          },
        },
        {
          step: {
            rule: 'logic.propositional.truezeroand',
            location: [],
            environment: {},
          },
          context: {
            term: '¬q ∧ q',
            environment: {},
            location: [],
          },
        },
        {
          step: {
            rule: 'logic.propositional.compland',
            location: [],
            environment: {},
          },
          context: {
            term: 'F',
            environment: {},
            location: [],
          },
        },
      ],
    },
  },
  version: '1.8.1 (27a352d26571dad5913f9786c09ce5cda3021793)',
};
