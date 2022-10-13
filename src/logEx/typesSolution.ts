export type SolutionResponse = {
  derivation?: SubDerivation;
  solution?: any;
  version: string;
};

type SubDerivation = {
  derivation?: SubSubDerivation;
};

type SubSubDerivation = {
  context?: Context;
  derivationsteps?: DerivationStep[];
};

type Context = {
  term: string;
  environment: any;
  location: any;
};

type DerivationStep = {
  step: Step;
  context: DerivationStepContext;
};

type Step = any;

type DerivationStepContext = {
  term: string;
  environment: any;
  location: Location;
};

type Location = number[];
