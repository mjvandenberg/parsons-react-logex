# parsons-react-logex

[View live demo 🌐](https://mjvandenberg.github.io/parsons-react-logex/)

A prototype implementing Parsons problems for teaching logical equivalence rewriting, developed as part of a master's thesis in Software Engineering.

## Background

Many teachers and computer science students find it challenging to work with logical formulas and rewrite rules. It often takes a significant amount of effort from students to fully comprehend these concepts, which can lead to discouragement and even dropout from the programme.

Learning the subject matter is challenging due to various aspects, such as knowing the rewrite rules, recognising patterns, and dealing with mathematical syntax. When these aspects are learnt at the same time, they can overwhelm students due to cognitive overload.

The Parsons problem is a puzzle designed to teach programming by allowing students to complete tasks through drag-and-drop without typing or starting from scratch. This method (scaffolding) reduces cognitive load and promotes learning.

This prototype adapts the Parsons problem to logical equivalence proofs. The user drags logical formula blocks into the correct order and selects the rewrite rule applied between each step. Feedback is provided to guide the learner.

The study shows that using Parsons problems in an online tutoring system with feedback services can be beneficial for novice learners.

## Features

- Drag-and-drop Parsons problem interface for logical equivalence proofs (mouse, touch and keyboard)
- Rewrite rule selection between blocks
- Instant and on-demand feedback modes
- Hint system (top-down and bottom-up)
- Multiple exercises with adjustable difficulty
- Settings for feedback style and auto-fill of rewrite rules
- English and Dutch
- Light and dark mode, following the system by default
- Reusable as a Web Component without dependencies

## Paper

This prototype was presented at **Koli Calling '24** (International Conference on Computing Education Research):

> **Parsons Problems for Equivalence Proofs in Logic**
> Marten van den Berg, Bastiaan Heeren, Ebrahim Rahimi — *Koli Calling 2024*, pp. 10:1–10:12
> [ACM Digital Library (doi:10.1145/3699538.3699551)](https://doi.org/10.1145/3699538.3699551)

The underlying master's thesis is available open-access:
> [Parsons Problems in Logic Tutoring Systems — Open Universiteit, 2023](https://research.ou.nl/en/studentTheses/parsons-problems-in-logic-tutoring-systems/)

The original version of the codebase as referenced in the paper is preserved under the git tag [`v1.0-paper`](https://github.com/mjvandenberg/parsons-react-logex/releases/tag/v1.0-paper).

The React version that followed it is preserved in the git history; since version 2 the prototype is a dependency-free Web Component.

## Using the Web Component

`<parsons-proof>` is a native Custom Element with no runtime dependencies (about 11 kB gzipped). Load the ES module and give it an exercise:

```html
<script type="module" src="https://mjvandenberg.github.io/parsons-react-logex/lib/parsons-proof.js"></script>

<parsons-proof live-feedback lang="nl"></parsons-proof>

<script type="module">
  const proof = document.querySelector('parsons-proof');
  proof.exercise = oneFinalResponse; // a LogEx "onefinal" response, see src/core/logex/data
  proof.addEventListener('parsons-solved', () => console.log('solved'));
</script>
```

| | |
|---|---|
| **Attributes** | `live-feedback`, `only-correct`, `auto-fill-rules`, `no-distractors`, `theme` (`auto`, `light`, `dark`); the language (`en`, `nl`) follows the nearest `lang` attribute |
| **Properties** | `exercise` (LogEx oneFinal response), `problem` (a ready-made `ParsonsProblem`), `settings`, `state`, `isValid` |
| **Methods** | `check()`, `hint()`, `completeStep()`, `showSolution()`, `solve()`, `reset()` |
| **Events** | `parsons-change` (`{ left, right, isValid }`), `parsons-solved`, `parsons-help` (`{ kind }`) — useful for logging learner steps |
| **Styling** | CSS custom properties such as `--parsons-accent`, `--parsons-green`, `--parsons-formula-font`, and `::part()` for `title`, `block`, `rule`, `toolbar`, … |

Learners drag blocks (mouse, pen or touch), click a block to add it to or remove it from the solution, or use the keyboard: Arrow keys move focus and Alt+Arrow keys reorder the solution. The formulas use the KaTeX font when the page loads it.

**Dark mode.** The colours use CSS `light-dark()`, so the component follows its `color-scheme`. Without a `theme` attribute it inherits the page's `color-scheme`: on a page with `color-scheme: light dark` it follows the system, on a page that declares nothing it stays light. `theme="auto"` follows the system regardless of the page, `theme="light"` and `theme="dark"` fix it; with a `theme` attribute the component also gets its own background, since it may then differ from the page. Custom colours can be set the same way, for example `parsons-proof { --parsons-accent: light-dark(#7c3aed, #a78bfa); }`.

The demo site follows the system theme by default; *Settings → Appearance* lets the learner choose light or dark instead. The choice is stored and applied before the page is drawn.

The component targets browsers with the Popover API, `<dialog>` and `light-dark()` (Baseline 2024).

### TypeScript

The build ships type declarations next to the module: `dist/lib/parsons-proof.d.ts` with the files it refers to in `dist/lib/types/`. Copy `dist/lib/` into your project and import the module from there; TypeScript picks up the declarations automatically.

```ts
import { ParsonsProof, type OneFinalResponse } from './vendor/parsons-proof/parsons-proof.js';

const proof = document.querySelector('parsons-proof')!; // typed as ParsonsProof
proof.exercise = response as OneFinalResponse;
proof.addEventListener('parsons-change', (e) => {
  console.log(e.detail.isValid, e.detail.right.map((block) => block.text)); // typed detail
});
```

Importing the module also registers `<parsons-proof>` in `HTMLElementTagNameMap` and its events in `HTMLElementEventMap`, so `querySelector`, `createElement` and `addEventListener` are typed. The declarations work with both `"moduleResolution": "Bundler"` and `"NodeNext"`; the build checks this by compiling a small consumer project (`types-test/`) against them.

## Project structure

```
src/core/      domain logic in plain TypeScript: validation, hints, moves, LogEx conversion, exercises
src/element/   the <parsons-proof> Web Component
site/          the demo site: exercise picker, settings dialog, event log
types-test/    a consumer project that type-checks the published declarations
```

Relative imports in `src/` use `.js` extensions so the generated declarations also resolve under `NodeNext`.

A boundary test keeps `src/core` and `src/element` free of third-party imports.

## Tech stack

- TypeScript 7, native Web Components, Popover API, `<dialog>`, Pointer Events, Web Animations API
- Vite 8 and Vitest 5 (with happy-dom) as development tools only

## Running locally

Prerequisites: Node.js 22.12 or newer (26 recommended, see `.nvmrc`), npm

```bash
npm install
```

Then run the tests, start in dev mode, or build for production:

```bash
npm run test:watch   # tests in watch mode
npm run dev          # development server
npm run build        # site in dist/, component and its types in dist/lib/
npm run build:lib    # only the component and its types
```
