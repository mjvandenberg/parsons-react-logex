import '../src/element';
import exercises from '../src/core/logex/data/equivalence/all';

const el = document.querySelector('parsons-proof')!;
const form = document.querySelector<HTMLFormElement>('#controls')!;
const select = form.elements.namedItem('exercise') as HTMLSelectElement;
const log = document.querySelector('#log')!;

select.append(...Object.keys(exercises).map((name) => new Option(name)));
const load = () => (el.exercise = exercises[select.value as keyof typeof exercises]);

form.addEventListener('change', (e) => {
  const input = e.target as HTMLInputElement | HTMLSelectElement;
  if (input === select) return load();
  if (input.name === 'lang') return el.setAttribute('lang', input.value);
  el.toggleAttribute(input.name, (input as HTMLInputElement).checked);
});

for (const type of ['parsons-change', 'parsons-solved', 'parsons-help']) {
  el.addEventListener(type, (e) => {
    const { detail } = e as CustomEvent;
    const summary =
      type === 'parsons-help' ? detail.kind : `valid=${el.isValid}, ${detail.right.length} blocks in solution`;
    log.prepend(`${new Date().toLocaleTimeString()}  ${type}  ${summary}\n`);
  });
}

load();
