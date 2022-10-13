export type SolutionResponse = {
  derivation?: Derivation;
  solution?: Derivation;
  version: string;
};

type Derivation = {
  derivation?: SubDerivation;
};

type SubDerivation = {
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
