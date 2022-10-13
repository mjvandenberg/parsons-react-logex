import { SolutionResponse } from '../../../logEx/typesSolution';
import { OneFinalResponse } from '../../logEx/typesOneFinal';

const request = {
  service: 'solution',
  state: {
    exerciseid: 'logic.propositional.proof-new.unicode',
    prefix: '[]',
    context: {
      term: ['¬(p∧q)∨s∨¬r', { type: '=', motivation: '<GAP>' }, '(p∧q)→(r→s)'],
      environment: {},
      location: [],
    },
  },
};

const response: SolutionResponse = {
  solution: {
    derivation: {
      context: {
        term: [
          '¬(p ∧ q) ∨ s ∨ ¬r',
          {
            type: '=',
            motivation: '<GAP>',
          },
          '(p ∧ q) → (r → s)',
        ],
        environment: {},
        location: [],
      },
      derivationsteps: [
        {
          step: {
            rule: 'logic.propositional.defimpl',
            location: [],
            environment: {},
          },
          context: {
            term: [
              '¬(p ∧ q) ∨ s ∨ ¬r',
              {
                type: '=',
                motivation: '<GAP>',
              },
              '¬(p ∧ q) ∨ (r → s)',
              {
                type: '=',
                motivation: 'logic.propositional.defimpl',
              },
              '(p ∧ q) → (r → s)',
            ],
            environment: {
              direction: '1',
              part: '0',
            },
            location: [],
          },
        },
        {
          step: {
            rule: 'logic.propositional.defimpl',
            location: [],
            environment: {},
          },
          context: {
            term: [
              '¬(p ∧ q) ∨ s ∨ ¬r',
              {
                type: '=',
                motivation: '<GAP>',
              },
              '¬(p ∧ q) ∨ ¬r ∨ s',
              {
                type: '=',
                motivation: 'logic.propositional.defimpl',
              },
              '¬(p ∧ q) ∨ (r → s)',
              {
                type: '=',
                motivation: 'logic.propositional.defimpl',
              },
              '(p ∧ q) → (r → s)',
            ],
            environment: {
              direction: '1',
              part: '0',
            },
            location: [],
          },
        },
        {
          step: {
            rule: 'logic.propositional.top-is-or.com',
            location: [],
            environment: {},
          },
          context: {
            term: [
              '¬(p ∧ q) ∨ s ∨ ¬r',
              {
                type: '=',
                motivation: 'logic.propositional.top-is-or.com',
              },
              '¬(p ∧ q) ∨ ¬r ∨ s',
              {
                type: '=',
                motivation: '<CLOSE>',
              },
              '¬(p ∧ q) ∨ ¬r ∨ s',
              {
                type: '=',
                motivation: 'logic.propositional.defimpl',
              },
              '¬(p ∧ q) ∨ (r → s)',
              {
                type: '=',
                motivation: 'logic.propositional.defimpl',
              },
              '(p ∧ q) → (r → s)',
            ],
            environment: {
              direction: '0',
              part: '0',
            },
            location: [],
          },
        },
      ],
    },
  },
  version: '1.8.1 (27a352d26571dad5913f9786c09ce5cda3021793)',
};

export default response;
