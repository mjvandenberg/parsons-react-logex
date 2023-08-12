// request: https://ideas.science.uu.nl/cgi-bin/ideas-logic.cgi?input={"service":"onefinal","state":{"exerciseid":"logic.propositional.proof-new.unicode","prefix":"[]","context":{"term":["¬(p ∨ ¬(p ∨ ¬q))",{"type":"=","motivation":"<GAP>"},"¬(p ∨ q)"],"environment":{},"location":[]}}}

import { OneFinalResponse } from "../../typesOneFinal";

const request = {
  service: "onefinal",
  state: {
    exerciseid: "logic.propositional.proof-new.unicode",
    prefix: "[]",
    context: {
      term: [
        "¬(p ∨ ¬(p ∨ ¬q))",
        {
          type: "=",
          motivation: "<GAP>",
        },
        "¬(p ∨ q)",
      ],
      environment: {},
      location: [],
    },
  },
};

export const response: OneFinalResponse = {
  name: "Normal",
  distractors: [
    {
      fromTerm: "¬(p ∨ (¬p ∧ ¬¬q))",
      term: "¬(p ∨ (¬p ∨ ¬¬q))",
      motivation: "buggy-rule-name-demorgan-1",
    },
  ],
  onefinal: {
    context: {
      term: [
        "¬(p ∨ ¬(p ∨ ¬q))",
        { type: "=", motivation: "logic.propositional.demorganor" },
        "¬(p ∨ (¬p ∧ ¬¬q))",
        { type: "=", motivation: "logic.propositional.notnot" },
        "¬(p ∨ (¬p ∧ q))",
        { type: "=", motivation: "logic.propositional.specialdistrnotr" },
        "¬((p ∨ ¬p) ∧ (p ∨ q))",
        { type: "=", motivation: "logic.propositional.complor" },
        "¬(T ∧ (p ∨ q))",
        { type: "=", motivation: "logic.propositional.truezeroand" },
        "¬(p ∨ q)",
        { type: "=", motivation: "<CLOSE>" },
        "¬(p ∨ q)",
      ],
      environment: { direction: "0", part: "0" },
      location: [],
    },
  },
  version: "1.8.1 (27a352d26571dad5913f9786c09ce5cda3021793)",
};

export default response;
