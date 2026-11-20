import { ExerciseType, ParsonsProblem, ParsonsUiItem } from '../types.js';
import { OneFinalResponse } from './typesOneFinal.js';
export declare const oneFinalToParsonsProblem: (oneFinal: OneFinalResponse, exerciseType: ExerciseType, includeDistractors: boolean) => ParsonsProblem;
export declare const groupPairs: (list: ParsonsUiItem[]) => ParsonsUiItem[];
export declare const OneFinaleResponseToParsonsSolution: (oneFinalResponse: OneFinalResponse) => ParsonsUiItem[];
export declare function shuffle<T>(array: T[]): T[];
