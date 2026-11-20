import { ParsonsProof } from './parsons-proof.js';
import type { ParsonsChangeDetail, ParsonsHelpDetail } from './parsons-proof.js';
import type { ParsonsState } from '../core/types.js';
export { ParsonsProof };
export type { ParsonsChangeDetail, ParsonsHelpDetail } from './parsons-proof.js';
export type { OneFinalResponse } from '../core/logex/typesOneFinal.js';
export type { ExerciseDescription, ExerciseType, ParsonsItem, ParsonsProblem, ParsonsState, ParsonsStatus, ParsonsUiItem, Settings, } from '../core/types.js';
/** The custom events of `<parsons-proof>`, for typed `addEventListener`. */
export interface ParsonsProofEventMap {
    'parsons-change': CustomEvent<ParsonsChangeDetail>;
    'parsons-solved': CustomEvent<ParsonsState>;
    'parsons-help': CustomEvent<ParsonsHelpDetail>;
}
declare global {
    interface HTMLElementTagNameMap {
        'parsons-proof': ParsonsProof;
    }
    interface HTMLElementEventMap extends ParsonsProofEventMap {
    }
}
