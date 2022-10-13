import { Rule } from '../logEx/rules';

export type OneFinalResponse = {
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
  motivation: Rule;
};
