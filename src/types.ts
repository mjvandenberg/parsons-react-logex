import { ItemInterface } from 'react-sortablejs';

export interface ItemType extends ItemInterface {
  text: string;
  isStaticFirst?: boolean;
  isStaticLast?: boolean;
  pairedGroupName?: string;
}

export interface ParsonsProblemProperties {
  exerciseName: string;
  exerciseDescription: string | JSX.Element;
  listLeft: ItemType[];
  listRight: ItemType[];
}
