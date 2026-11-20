// UI-layer types. Domain types live in ./core/types and are re-exported here
// so components can keep importing from one place.
export * from './core/types';

import type { ParsonsUiItem } from './core/types';

export type GetFeedbackStyle = (
  showFeedback: boolean,
  item: ParsonsUiItem
) => string;
