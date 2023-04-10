import { ItemInterface } from 'react-sortablejs';

export const languages = ['nl', 'en'] as const;
export type Language = typeof languages[number];

export interface ParsonsUiItem extends ItemInterface {
  text: string;
  rule?: string;
  isStaticFirst?: boolean;
  isStaticLast?: boolean;
  pairedGroupName?: string;
  isValid?: boolean;
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

export interface ParsonsSolutionItem {
  text: string;
  rule?: string;
}

////////
export const status = ['green', 'red', "yellow", "unknown"] as const;
export type ParsonsStatus = typeof status[number];

export type WithStatus = { status: ParsonsStatus }
export type WithText = { text: string };
export type ParsonsItem = {
  text: string;
  type: Block | Rule;
}
export type ValidatedParsonsItem = ParsonsItem & WithStatus;

export type Block = "block";
export type Rule = "rule";

export const b = "block";
export const r = "rule";

