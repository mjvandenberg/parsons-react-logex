import { defineConfig, Plugin, transformWithEsbuild } from 'vite';
import { execSync } from 'child_process';

function getCommitHash(): string {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'dev';
  }
}

// Vite keeps whitespace in ES library builds; minify the final bundle fully.
const minifyBundle = (): Plugin => ({
  name: 'minify-bundle',
  async generateBundle(_, bundle) {
    for (const chunk of Object.values(bundle)) {
      if (chunk.type !== 'chunk') continue;
      const { code } = await transformWithEsbuild(chunk.code, chunk.fileName, {
        minify: true,
        target: TARGET,
      });
      chunk.code = code;
    }
  },
});

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

// https://vitejs.dev/config/
export default defineConfig(({ mode }) =>
  mode === 'lib'
    ? {
        // `vite build --mode lib`: the Web Component as one ES module,
        // published next to the site at <base>/lib/parsons-proof.js.
        plugins: [minifyBundle(), typesEntry()],
        build: {
          target: TARGET,
          cssMinify: true,
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
        build: { target: TARGET },
        define: {
          __COMMIT_SHA__: JSON.stringify(
            process.env.VITE_COMMIT_SHA?.substring(0, 7) ?? getCommitHash()
          ),
        },
      }
);
