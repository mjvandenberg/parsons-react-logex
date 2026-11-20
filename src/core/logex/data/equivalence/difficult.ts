// request: https://ideas.science.uu.nl/cgi-bin/ideas-logic.cgi?input={"service":"onefinal","state":{"exerciseid":"logic.propositional.proof-new.unicode","prefix":"[]","context":{"term":["(q → (¬p → q)) → p",{"type":"=","motivation":"<GAP>"},"¬p → (q ∧ (p ∧ q) ∧ q)"],"environment":{},"location":[]}}}

import { OneFinalResponse } from "../../typesOneFinal";

const request = {
  service: "onefinal",
  state: {
    exerciseid: "logic.propositional.proof-new.unicode",
    prefix: "[]",
    context: {
      term: [
        "(q → (¬p → q)) → p",
        {
          type: "=",
          motivation: "<GAP>",
        },
        "¬p → (q ∧ (p ∧ q) ∧ q)",
      ],
      environment: {},
      location: [],
    },
  },
};

export const response: OneFinalResponse = {
  name: "Normal",
  distractors: [],
  onefinal: {
    context: {
      term: [
        "(q → (¬p → q)) → p",
        { type: "=", motivation: "logic.propositional.defimpl" },
        "¬(q → (¬p → q)) ∨ p",
        { type: "=", motivation: "logic.propositional.defimpl" },
        "¬(¬q ∨ (¬p → q)) ∨ p",
        { type: "=", motivation: "logic.propositional.defimpl" },
        "¬(¬q ∨ ¬¬p ∨ q) ∨ p",
        { type: "=", motivation: "logic.propositional.complor.sort" },
        "¬(¬q ∨ q ∨ ¬¬p) ∨ p",
        { type: "=", motivation: "logic.propositional.complor" },
        "¬(T ∨ ¬¬p) ∨ p",
        { type: "=", motivation: "logic.propositional.truezeroor" },
        "¬T ∨ p",
        { type: "=", motivation: "logic.propositional.nottrue" },
        "F ∨ p",
        { type: "=", motivation: "logic.propositional.falsezeroor" },
        "p",
        { type: "=", motivation: "<CLOSE>" },
        "p",
        { type: "=", motivation: "logic.propositional.absorpor" },
        "p ∨ (q ∧ p)",
        { type: "=", motivation: "logic.propositional.notnot" },
        "¬¬p ∨ (q ∧ p)",
        { type: "=", motivation: "logic.propositional.defimpl" },
        "¬p → (q ∧ p)",
        { type: "=", motivation: "logic.propositional.idempand" },
        "¬p → (q ∧ q ∧ p)",
        { type: "=", motivation: "logic.propositional.idempand" },
        "¬p → (q ∧ q ∧ q ∧ p)",
        { type: "=", motivation: "logic.propositional.compland.sort" },
        "¬p → (q ∧ (p ∧ q) ∧ q)",
      ],
      environment: { direction: "1", part: "0" },
      location: [],
    },
  },
  version: "1.8.1 (27a352d26571dad5913f9786c09ce5cda3021793)",
};

export default response;
