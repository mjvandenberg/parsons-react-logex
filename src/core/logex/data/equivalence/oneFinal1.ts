import { OneFinalResponse } from "../../typesOneFinal";

// request: https://ideas.science.uu.nl/cgi-bin/ideas-logic.cgi?input={"service":"onefinal","state":{"exerciseid":"logic.propositional.proof-new.unicode","prefix":"[]","context":{"term":["¬(p ∧ q) ∨ s ∨ ¬r",{"type":"=","motivation":"<GAP>"},"(p ∧ q) → (r → s)"],"environment":{},"location":[]}}}

const response: OneFinalResponse = {
  name: "Exercise 1",
  distractors: [
    {
      fromTerm: "¬(p ∧ q) ∨ (r → s)",
      term: "¬(p ∧ q) ∨ ¬(r → s)",
      motivation: "buggy-rule-name-defimpl-1",
    },
  ],
  onefinal: {
    context: {
      term: [
        "¬(p ∧ q) ∨ s ∨ ¬r",
        {
          type: "=",
          motivation: "logic.propositional.top-is-or.com",
        },
        "¬(p ∧ q) ∨ ¬r ∨ s",
        {
          type: "=",
          motivation: "<CLOSE>",
        },
        "¬(p ∧ q) ∨ ¬r ∨ s",
        {
          type: "=",
          motivation: "logic.propositional.defimpl",
        },
        "¬(p ∧ q) ∨ (r → s)",
        {
          type: "=",
          motivation: "logic.propositional.defimpl",
        },
        "(p ∧ q) → (r → s)",
      ],
      environment: {
        direction: "0",
        part: "0",
      },
      location: [],
    },
  },
  version: "1.8.1 (27a352d26571dad5913f9786c09ce5cda3021793)",
};

export default response;
