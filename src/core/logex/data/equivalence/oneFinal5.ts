import { OneFinalResponse } from "../../typesOneFinal";

const request = {
  service: "onefinal",
  state: {
    exerciseid: "logic.propositional.proof-new.unicode",
    prefix: "[]",
    context: {
      term: [
        "(p ∧ q ∧ r) ∨ (¬p ∧ q)",
        {
          type: "=",
          motivation: "<GAP>",
        },
        "(¬p ∧ q ∧ ¬r) ∨ (q ∧ r)",
      ],
      environment: {},
      location: [],
    },
  },
};

export const response: OneFinalResponse = {
  name: "Exercise 5",
  distractors: [
    {
      fromTerm: "(q ∧ p ∧ r) ∨ (q ∧ ¬p)",
      term: "(q ∧ p ∧ r) ∧ (q ∧ ¬p)",
      motivation: "buggy-rule-inv.common-literal-1",
    },
  ],
  onefinal: {
    context: {
      term: [
        "(p ∧ q ∧ r) ∨ (¬p ∧ q)",
        {
          type: "=",
          motivation: "logic.propositional.command.common-literal",
        },
        "(q ∧ p ∧ r) ∨ (q ∧ ¬p)",
        {
          type: "=",
          motivation: "logic.propositional.andoveror.inv.common-literal",
        },
        "q ∧ ((p ∧ r) ∨ ¬p)",
        {
          type: "=",
          motivation: "logic.propositional.specialdistrnotr",
        },
        "q ∧ (p ∨ ¬p) ∧ (r ∨ ¬p)",
        {
          type: "=",
          motivation: "logic.propositional.complor",
        },
        "q ∧ T ∧ (r ∨ ¬p)",
        {
          type: "=",
          motivation: "logic.propositional.top-is-and.com",
        },
        "q ∧ (r ∨ ¬p) ∧ T",
        {
          type: "=",
          motivation: "logic.propositional.top-is-or.com",
        },
        "q ∧ (¬p ∨ r) ∧ T",
        {
          type: "=",
          motivation: "<CLOSE>",
        },
        "q ∧ (¬p ∨ r) ∧ T",
        {
          type: "=",
          motivation: "logic.propositional.complor",
        },
        "q ∧ (¬p ∨ r) ∧ (¬r ∨ r)",
        {
          type: "=",
          motivation: "logic.propositional.specialdistrnotr",
        },
        "q ∧ ((¬p ∧ ¬r) ∨ r)",
        {
          type: "=",
          motivation: "logic.propositional.andoveror.inv.common-literal",
        },
        "(q ∧ ¬p ∧ ¬r) ∨ (q ∧ r)",
        {
          type: "=",
          motivation: "logic.propositional.command.common-literal",
        },
        "(¬p ∧ q ∧ ¬r) ∨ (q ∧ r)",
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
