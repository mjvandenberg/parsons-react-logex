// Compiled against the built declarations (dist/lib/parsons-proof.d.ts) as a
// consumer would, to check the published type surface. Never executed.
import { ParsonsProof } from '../dist/lib/parsons-proof.js';
import type {
  OneFinalResponse,
  ParsonsChangeDetail,
  ParsonsHelpDetail,
  ParsonsProblem,
  ParsonsState,
  Settings,
} from '../dist/lib/parsons-proof.js';

declare const response: OneFinalResponse;

// The tag name maps to the class.
const proof: ParsonsProof = document.createElement('parsons-proof');
const found: ParsonsProof | null = document.querySelector('parsons-proof');

// Properties
proof.exercise = response;
const problem: ParsonsProblem | undefined = proof.problem;
const settings: Settings = proof.settings;
proof.settings = { ...settings, instantFeedback: true };
proof.liveFeedback = true;
proof.onlyCorrect = false;
proof.autoFillRules = true;
const state: ParsonsState = proof.state;
const valid: boolean = proof.isValid;

// Methods
const checked: boolean = proof.check();
proof.hint();
proof.completeStep();
proof.showSolution();
proof.solve();
proof.reset();

// Events are typed, on the element and on its ancestors.
proof.addEventListener('parsons-change', (e) => {
  const detail: ParsonsChangeDetail = e.detail;
  const steps: string[] = detail.right.map((item) => item.text);
  void steps;
});
proof.addEventListener('parsons-solved', (e) => {
  const solved: ParsonsState = e.detail;
  void solved;
});
document.body.addEventListener('parsons-help', (e) => {
  const kind: ParsonsHelpDetail['kind'] = e.detail.kind;
  void kind;
});

// Mistakes are caught.
// @ts-expect-error unknown help kind
const wrongKind: ParsonsHelpDetail['kind'] = 'cheat';
// @ts-expect-error settings needs all three flags
proof.settings = { instantFeedback: true };
// @ts-expect-error check() takes no arguments
proof.check(true);
// @ts-expect-error internal state is private
proof.left;

void [problem, state, valid, checked, found, wrongKind];
