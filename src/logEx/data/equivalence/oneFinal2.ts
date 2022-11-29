import { OneFinalResponse } from '../../typesOneFinal';

// request: https://ideas.science.uu.nl/cgi-bin/ideas-logic.cgi?input={"service":"onefinal","state":{"exerciseid":"logic.propositional.proof-new.unicode","prefix":"[]","context":{"term":["¬((p → q) → (p ∧ q))",{"type":"=","motivation":"<GAP>"},"(p → q) ∧ (¬p ∨ ¬q)"],"environment":{},"location":[]}}}

const response: OneFinalResponse = {
  name: 'Exercise 2',
  distractors: [],
  onefinal: {
    context: {
      term: [
        '¬((p → q) → (p ∧ q))',
        { type: '=', motivation: 'logic.propositional.defimpl' },
        '¬(¬(p → q) ∨ (p ∧ q))',
        { type: '=', motivation: 'logic.propositional.defimpl' },
        '¬(¬(¬p ∨ q) ∨ (p ∧ q))',
        { type: '=', motivation: 'logic.propositional.demorganor' },
        '¬¬(¬p ∨ q) ∧ ¬(p ∧ q)',
        { type: '=', motivation: 'logic.propositional.notnot' },
        '(¬p ∨ q) ∧ ¬(p ∧ q)',
        { type: '=', motivation: 'logic.propositional.demorganand' },
        '(¬p ∨ q) ∧ (¬p ∨ ¬q)',
        { type: '=', motivation: '<CLOSE>' },
        '(¬p ∨ q) ∧ (¬p ∨ ¬q)',
        { type: '=', motivation: 'logic.propositional.defimpl' },
        '(p → q) ∧ (¬p ∨ ¬q)',
      ],
      environment: { direction: '0', part: '0' },
      location: [],
    },
  },
  version: '1.8.1 (27a352d26571dad5913f9786c09ce5cda3021793)',
};

export default response;
