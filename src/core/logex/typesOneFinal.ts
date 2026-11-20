import { Rule } from './rules';

export type OneFinalResponse = {
  name?: string;
  distractors?: Distractor[];
  onefinal: OneFinal;
  version: string;
};

type OneFinal = {
  context: Context;
};

type Context = {
  term: (string | Term)[];
  environment: any;
  location: any;
};

export type Term = {
  type: string;
  motivation: string;
};

type Distractor = {
  fromTerm: string;
  term: string;
  motivation: string;
};
