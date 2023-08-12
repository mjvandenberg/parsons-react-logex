// request: https://ideas.science.uu.nl/cgi-bin/ideas-logic.cgi?input={"service":"onefinal","state":{"exerciseid":"logic.propositional.proof-new.unicode","prefix":"[]","context":{"term":["(¬p ∨ q) ∧ ¬r",{"type":"=","motivation":"<GAP>"},"¬(p ∨ r) ∨ (q ∧ ¬r)"],"environment":{},"location":[]}}}

import { OneFinalResponse } from "../../typesOneFinal";

const request = {
  service: "onefinal",
  state: {
    exerciseid: "logic.propositional.proof-new.unicode",
    prefix: "[]",
    context: {
      term: [
        "(p ∨ q) → q",
        {
          type: "=",
          motivation: "<GAP>",
        },
        "p → q",
      ],
      environment: {},
      location: [],
    },
  },
};

export const response: OneFinalResponse = {
  name: "Easy",
  distractors: [
    {
      fromTerm: "(¬p ∧ ¬r) ∨ (q ∧ ¬r)",
      term: "(¬p ∧ ¬r) ∧ (q ∧ ¬r)",
      motivation: "buggy-rule-distribution-1",
    },
  ],
  onefinal: {
    context: {
      term: [
        "(¬p ∨ q) ∧ ¬r",
        { type: "=", motivation: "<CLOSE>" },
        "(¬p ∨ q) ∧ ¬r",
        {
          type: "=",
          motivation: "logic.propositional.andoveror.inv.common-literal",
        },
        "(¬p ∧ ¬r) ∨ (q ∧ ¬r)",
        { type: "=", motivation: "logic.propositional.demorganor" },
        "¬(p ∨ r) ∨ (q ∧ ¬r)",
      ],
      environment: { direction: "1", part: "0" },
      location: [],
    },
  },
  version: "1.8.1 (27a352d26571dad5913f9786c09ce5cda3021793)",
};

export default response;
