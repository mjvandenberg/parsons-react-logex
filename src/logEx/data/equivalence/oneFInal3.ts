import { OneFinalResponse } from '../../typesOneFinal';

// request: https://ideas.science.uu.nl/cgi-bin/ideas-logic.cgi?input={"service":"onefinal","state":{"exerciseid":"logic.propositional.proof-new.unicode","prefix":"[]","context":{"term":["¬((p ↔ q) → (p ∨ (p ↔ q)))",{"type":"=","motivation":"<GAP>"},"F"],"environment":{},"location":[]}}}

const response: OneFinalResponse = {
  name: 'Exercise 3',
  distractors: [],
  onefinal: {
    context: {
      term: [
        '¬((p ↔ q) → (p ∨ (p ↔ q)))',
        { type: '=', motivation: 'logic.propositional.defimpl' },
        '¬(¬(p ↔ q) ∨ p ∨ (p ↔ q))',
        { type: '=', motivation: 'logic.propositional.complor.sort' },
        '¬(¬(p ↔ q) ∨ (p ↔ q) ∨ p)',
        { type: '=', motivation: 'logic.propositional.complor' },
        '¬(T ∨ p)',
        { type: '=', motivation: 'logic.propositional.truezeroor' },
        '¬T',
        { type: '=', motivation: 'logic.propositional.nottrue' },
        'F',
        { type: '=', motivation: '<CLOSE>' },
        'F',
      ],
      environment: { direction: '0', part: '0' },
      location: [],
    },
  },
  version: '1.8.1 (27a352d26571dad5913f9786c09ce5cda3021793)',
};

export default response;
