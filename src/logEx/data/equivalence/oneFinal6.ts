import { OneFinalResponse } from '../../typesOneFinal';

const request = {
  service: 'onefinal',
  state: {
    exerciseid: 'logic.propositional.proof-new.unicode',
    prefix: '[]',
    context: {
      term: [
        '(p ∨ q) → q',
        {
          type: '=',
          motivation: '<GAP>',
        },
        'p → q',
      ],
      environment: {},
      location: [],
    },
  },
};

export const response: OneFinalResponse = {
  name: 'Exercise 6',
  distractors: [
    {
      fromTerm: '(¬p ∧ ¬q) ∨ q',
      term: '(¬p ∨ ¬q) ∨ q',
      motivation: 'DeMorgan1',
    },
  ],
  "onefinal": {
    "context": {
      "environment": {
        "direction": "0",
        "part": "0"
      },
      "location": [
      ],
      "term": [
        "(p ∨ q) → q",
        {
          "motivation": "logic.propositional.defimpl",
          "type": "="
        },
        "¬(p ∨ q) ∨ q",
        {
          "motivation": "logic.propositional.demorganor",
          "type": "="
        },
        "(¬p ∧ ¬q) ∨ q",
        {
          "motivation": "logic.propositional.specialdistrnotr",
          "type": "="
        },
        "(¬p ∨ q) ∧ (¬q ∨ q)",
        {
          "motivation": "logic.propositional.complor",
          "type": "="
        },
        "(¬p ∨ q) ∧ T",
        {
          "motivation": "logic.propositional.truezeroand",
          "type": "="
        },
        "¬p ∨ q",
        {
          "motivation": "<CLOSE>",
          "type": "="
        },
        "¬p ∨ q",
        {
          "motivation": "logic.propositional.defimpl",
          "type": "="
        },
        "p → q"
      ]
    }
  },
  version: '1.8.1 (27a352d26571dad5913f9786c09ce5cda3021793)',
};

export default response;
