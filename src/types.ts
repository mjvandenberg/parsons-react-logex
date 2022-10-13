import { ItemInterface } from 'react-sortablejs';

export interface ParsonsItem extends ItemInterface {
  text: string;
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
