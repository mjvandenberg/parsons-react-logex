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

type Term = {
  type: string;
  motivation: string;
};
