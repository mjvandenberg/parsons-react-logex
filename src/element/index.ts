import { ParsonsProof } from './parsons-proof';

export { ParsonsProof };
export type { ParsonsChangeDetail, ParsonsHelpDetail } from './parsons-proof';
export type { OneFinalResponse } from '../core/logex/typesOneFinal';
export type { ParsonsProblem, ParsonsState, Settings } from '../core/types';

if (!customElements.get('parsons-proof')) {
  customElements.define('parsons-proof', ParsonsProof);
}

declare global {
  interface HTMLElementTagNameMap {
    'parsons-proof': ParsonsProof;
  }
}
