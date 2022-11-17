import { ItemInterface } from 'react-sortablejs';

export const languages = ['nl', 'en'] as const;
export type Language = typeof languages[number];

export interface ParsonsItem extends ItemInterface {
  text: string;
  rule?: string;
  isStaticFirst?: boolean;
  isStaticLast?: boolean;
  pairedGroupName?: string;
  isValid?: boolean;
}

export interface ParsonsProblemProperties {
  exerciseName: string;
  exerciseDescription: JSX.Element | string;
  exerciseSolution: ParsonsSolutionItem[];
  listLeft: ParsonsItem[];
  listRight: ParsonsItem[];
}

export interface ParsonsSolutionItem {
  text: string;
  rule?: string;
}
