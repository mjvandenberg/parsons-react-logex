import { OneFinalResponse } from '../../typesOneFinal';

// request: https://ideas.science.uu.nl/cgi-bin/ideas-logic.cgi?input={"service":"onefinal","state":{"exerciseid":"logic.propositional.proof-new.unicode","prefix":"[]","context":{"term":["(p ∧ ¬q) ∨ (q ∧ ¬p)",{"type":"=","motivation":"<GAP>"},"(p ∨ q) ∧ ¬(p ∧ q)"],"environment":{},"location":[]}}}

const response: OneFinalResponse = {
  name: 'Exercise 4',
  distractors: [],
  onefinal: {
    context: {
      term: [
        '(p ∧ ¬q) ∨ (q ∧ ¬p)',
        { type: '=', motivation: 'logic.propositional.top-is-or.com' },
        '(q ∧ ¬p) ∨ (p ∧ ¬q)',
        { type: '=', motivation: '<CLOSE>' },
        '(q ∧ ¬p) ∨ (p ∧ ¬q)',
        { type: '=', motivation: 'logic.propositional.falsezeroor' },
        '(q ∧ ¬p) ∨ (p ∧ ¬q) ∨ F',
        { type: '=', motivation: 'logic.propositional.compland' },
        '(q ∧ ¬p) ∨ (p ∧ ¬q) ∨ (q ∧ ¬q)',
        { type: '=', motivation: 'logic.propositional.specialdistrnotr' },
        '(q ∧ ¬p) ∨ ((p ∨ q) ∧ ¬q)',
        { type: '=', motivation: 'logic.propositional.falsezeroor' },
        '(F ∨ (q ∧ ¬p)) ∨ ((p ∨ q) ∧ ¬q)',
        { type: '=', motivation: 'logic.propositional.compland' },
        '((p ∧ ¬p) ∨ (q ∧ ¬p)) ∨ ((p ∨ q) ∧ ¬q)',
        { type: '=', motivation: 'logic.propositional.specialdistrnotr' },
        '((p ∨ q) ∧ ¬p) ∨ ((p ∨ q) ∧ ¬q)',
        { type: '=', motivation: 'logic.propositional.andoveror' },
        '(p ∨ q) ∧ (¬p ∨ ¬q)',
        { type: '=', motivation: 'logic.propositional.demorganand' },
        '(p ∨ q) ∧ ¬(p ∧ q)',
      ],
      environment: { direction: '0', part: '0' },
      location: [],
    },
  },
  version: '1.8.1 (27a352d26571dad5913f9786c09ce5cda3021793)',
};

export default response;
