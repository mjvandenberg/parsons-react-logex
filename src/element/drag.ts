// Drag and drop with Pointer Events: one code path for mouse, pen and touch.
//
// Draggable: `button.block[data-id]` inside `view`. Drop zones: the problem
// list (`.source .list`) and the solution list (`.target .list`). The ghost
// and the drop marker are `popover="manual"` elements, so they render in the
// top layer and can use viewport coordinates even though the host has
// layout containment (container-type).
import type { Panel } from '../core/moves';

export type Drop = { id: string; to: Panel; index?: number; from: DOMRect };

const THRESHOLD = 6;
const EDGE = 48;

/**
 * Where in the solution list a block lands: the number of blocks whose
 * vertical midpoint lies above `y`, kept between the first and last formula.
 */
export const solutionIndex = (midpoints: number[], y: number): number => {
  const above = midpoints.filter((m) => m < y).length;
  return Math.min(Math.max(above, 1), Math.max(midpoints.length - 1, 1));
};

const contains = (r: DOMRect, x: number, y: number, slack = 16) =>
  x >= r.left && x <= r.right && y >= r.top - slack && y <= r.bottom + slack;

const topLayer = (el: HTMLElement) => {
  el.popover = 'manual';
  return el;
};

export const enableDrag = (view: HTMLElement, onDrop: (drop: Drop) => void) => {
  let drag:
    | {
        id: string;
        el: HTMLElement;
        startX: number;
        startY: number;
        offsetX: number;
        offsetY: number;
        width: number;
        active: boolean;
        ghost?: HTMLElement;
        marker?: HTMLElement;
        drop?: Omit<Drop, 'from'>;
      }
    | undefined;
  let suppressClick = false;

  const lists = () => ({
    source: view.querySelector<HTMLElement>('.source .list'),
    target: view.querySelector<HTMLElement>('.target .list'),
  });

  const show = (el: HTMLElement) => {
    view.append(el);
    if (typeof el.showPopover === 'function') el.showPopover();
  };

  const start = () => {
    if (!drag) return;
    drag.active = true;
    drag.el.classList.add('dragging');
    view.dataset.dragging = '';

    const ghost = topLayer(document.createElement('div'));
    ghost.className = 'ghost';
    ghost.style.width = `${drag.width}px`;
    ghost.append(drag.el.cloneNode(true));
    const marker = topLayer(document.createElement('div'));
    marker.className = 'drop-marker';
    marker.hidden = true;
    show(ghost);
    show(marker);
    drag.ghost = ghost;
    drag.marker = marker;
  };

  const findDrop = (x: number, y: number): Omit<Drop, 'from'> | undefined => {
    const { source, target } = lists();
    source?.classList.remove('drop');
    drag!.marker!.hidden = true;

    if (target && contains(target.getBoundingClientRect(), x, y)) {
      const blocks = [...target.querySelectorAll<HTMLElement>('.block')].filter(
        (b) => b !== drag!.el
      );
      if (blocks.length === 0) return { id: drag!.id, to: 'right' };
      const rects = blocks.map((b) => b.getBoundingClientRect());
      const index = solutionIndex(rects.map((r) => r.top + r.height / 2), y);
      const prev = rects[index - 1];
      const next = rects[index];
      const markerY = next ? (prev.bottom + next.top) / 2 : prev.bottom + 4;
      const list = target.getBoundingClientRect();
      Object.assign(drag!.marker!.style, {
        top: `${markerY - 2}px`,
        left: `${list.left + 8}px`,
        width: `${list.width - 16}px`,
      });
      drag!.marker!.hidden = false;
      return { id: drag!.id, to: 'right', index };
    }

    if (source && contains(source.getBoundingClientRect(), x, y)) {
      source.classList.add('drop');
      return { id: drag!.id, to: 'left' };
    }
    return undefined;
  };

  const end = (commit: boolean) => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onCancel);
    window.removeEventListener('keydown', onKey, true);
    if (!drag) return;
    const { active, ghost, marker, drop, el } = drag;
    const from = ghost?.getBoundingClientRect();
    ghost?.remove();
    marker?.remove();
    el.classList.remove('dragging');
    delete view.dataset.dragging;
    lists().source?.classList.remove('drop');
    drag = undefined;
    if (active) {
      // The click that follows pointerup (if any) arrives before this timer.
      suppressClick = true;
      setTimeout(() => (suppressClick = false), 0);
    }
    if (active && commit && drop && from) onDrop({ ...drop, from });
  };

  const onMove = (e: PointerEvent) => {
    if (!drag) return;
    if (!drag.active) {
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < THRESHOLD) return;
      start();
    }
    e.preventDefault();
    Object.assign(drag.ghost!.style, {
      top: `${e.clientY - drag.offsetY}px`,
      left: `${e.clientX - drag.offsetX}px`,
    });
    drag.drop = findDrop(e.clientX, e.clientY);
    if (e.clientY < EDGE) window.scrollBy(0, -12);
    else if (e.clientY > window.innerHeight - EDGE) window.scrollBy(0, 12);
  };

  const onUp = () => end(true);
  const onCancel = () => end(false);
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !drag?.active) return;
    e.preventDefault();
    e.stopPropagation();
    end(false);
  };

  view.addEventListener('pointerdown', (e) => {
    suppressClick = false;
    if (drag || e.button !== 0 || !e.isPrimary) return;
    const el = (e.target as Element).closest<HTMLElement>('button.block[data-id]');
    if (!el) return;
    const box = el.getBoundingClientRect();
    drag = {
      id: el.dataset.id!,
      el,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - box.left,
      offsetY: e.clientY - box.top,
      width: box.width,
      active: false,
    };
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    window.addEventListener('keydown', onKey, true);
  });

  // A drag ends with a click on the block; it must not also move the block.
  view.addEventListener(
    'click',
    (e) => {
      if (!suppressClick) return;
      suppressClick = false;
      e.stopPropagation();
      e.preventDefault();
    },
    true
  );
};
