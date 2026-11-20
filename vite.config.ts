import { defineConfig, Plugin } from 'vite';
import { execSync } from 'child_process';

function getCommitHash(): string {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'dev';
  }
}

// Entry for the declarations that `tsc -p tsconfig.lib.json` writes to
// dist/lib/types, so `parsons-proof.js` and `parsons-proof.d.ts` sit together.
const typesEntry = (): Plugin => ({
  name: 'types-entry',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'parsons-proof.d.ts',
      source: "export * from './types/element/index.js';\n",
    });
  },
});

// Native private fields, static blocks etc.: supported by every browser that
// has the Popover API, which the component needs anyway.
const TARGET = 'es2022';

// The browsers the component needs anyway (Popover API, light-dark(): Baseline
// 2024). Without this, Lightning CSS rewrites light-dark() into a workaround
// with --lightningcss-* variables that only reacts to color-scheme set in CSS
// it processed itself, so the component would ignore a host page's
// color-scheme.
const CSS_TARGET = ['chrome123', 'edge123', 'firefox125', 'safari17.5'];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) =>
  mode === 'lib'
    ? {
        // `vite build --mode lib`: the Web Component as one ES module,
        // published next to the site at <base>/lib/parsons-proof.js.
        plugins: [typesEntry()],
        build: {
          target: TARGET,
          cssTarget: CSS_TARGET,
          cssMinify: true,
          // Vite keeps whitespace in ES library builds; minify the bundle fully.
          rolldownOptions: { output: { minify: true } },
          outDir: 'dist/lib',
          emptyOutDir: true,
          lib: {
            entry: 'src/element/index.ts',
            formats: ['es'],
            fileName: () => 'parsons-proof.js',
          },
        },
      }
    : {
        base: process.env.VITE_BASE_URL ?? '/parsons-react-logex/',
        build: { target: TARGET, cssTarget: CSS_TARGET },
        define: {
          __COMMIT_SHA__: JSON.stringify(
            process.env.VITE_COMMIT_SHA?.substring(0, 7) ?? getCommitHash()
          ),
        },
      }
);
