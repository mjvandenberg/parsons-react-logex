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

- Drag-and-drop Parsons problem interface for logical equivalence proofs
- Rewrite rule selection between blocks
- Instant and on-demand feedback modes
- Hint system (top-down and bottom-up)
- Multiple exercises with adjustable difficulty
- Settings for feedback style and auto-fill of rewrite rules

## Paper

The original version of the codebase as referenced in the published paper is preserved under the git tag [`v1.0-paper`](https://github.com/mjvandenberg/parsons-react-logex/releases/tag/v1.0-paper).

## Tech stack

- React 18, TypeScript 5
- Vite 5
- Tailwind CSS 3, DaisyUI 2
- Vitest

## Running locally

Prerequisites: Node.js, npm

```bash
npm install
```

Then run the tests, start in dev mode, or build for production:

```bash
npm run test:watch   # tests in watch mode
npm run dev          # development server
npm run build        # production build
```
