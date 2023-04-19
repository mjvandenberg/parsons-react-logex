import { ItemInterface } from 'react-sortablejs';

export const languages = ['nl', 'en'] as const;
export type Language = typeof languages[number];

export interface ParsonsUiItem extends ItemInterface {
  text: string;
  rule?: string;
  isStaticFirst?: boolean;
  isStaticLast?: boolean;
  pairedGroupName?: string;
  isValid: ParsonsStatus;
  isValidRule: ParsonsStatus;
}

export interface RewriteRule {
  text: string;
  isValid?: boolean;
}

export interface ParsonsProblemProperties {
  exerciseName: string;
  exerciseDescription: JSX.Element | string;
  exerciseSolution: ParsonsItem[];
  listLeft: ParsonsUiItem[];
  listRight: ParsonsUiItem[];
}

export interface Settings {
  instantFeedback: boolean;
  markInvalidItems: boolean;
}

export interface ParsonsSolutionItem {
  text: string;
  rule?: string;
}

export type GetFeedbackStyle = (
  showFeedback: boolean,
  item: ParsonsUiItem
) => string;

////////
type Block = 'block';
type Rule = 'rule';

const status = ['green', 'red', 'yellow', 'unknown'] as const;
export type ParsonsStatus = typeof status[number];

type WithStatus = { status: ParsonsStatus };
export type WithText = { text: string };
export type ParsonsItem = {
  text: string;
  type: Block | Rule;
};
export type ValidatedParsonsItem = ParsonsItem & WithStatus;
