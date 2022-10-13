import { ItemInterface } from 'react-sortablejs';

export const languages = ['nl', 'en'] as const;
export type Language = typeof languages[number];

export interface ParsonsItem extends ItemInterface {
  text: string;
  rule?: string;
  isStaticFirst?: boolean;
  isStaticLast?: boolean;
  pairedGroupName?: string;
}

export interface ParsonsProblemProperties {
  exerciseName: string;
  exerciseDescription: JSX.Element | string;
  listLeft: ParsonsItem[];
  listRight: ParsonsItem[];
}
