import type { Panel } from '../core/moves.js';
export type Drop = {
    id: string;
    to: Panel;
    index?: number;
    from: DOMRect;
};
/**
 * Where in the solution list a block lands: the number of blocks whose
 * vertical midpoint lies above `y`, kept between the first and last formula.
 */
export declare const solutionIndex: (midpoints: number[], y: number) => number;
export declare const enableDrag: (view: HTMLElement, onDrop: (drop: Drop) => void) => void;
