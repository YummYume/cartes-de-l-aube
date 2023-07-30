import { defineConfig } from 'vitest/config'
import { BaseSequencer } from 'vitest/node';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    test: {
      globals: true,
      globalSetup: 'test/setup.js',
      include: ['test/**/*.{test,spec}.js'],
      threads: false,
      isolate: false,
      watch: false,
      sequence: {
        sequencer: class Seqencer extends BaseSequencer {
          /**
            * @type {import('vitest/node').Context}
            */
          ctx;

          constructor(ctx) {
            super(ctx);
            this.ctx = ctx;
          }

          /**
            * @param {string[]} files
            * @returns
            */
          async shard(files) {
            return files;
          }

          /**
            * @param {string[]} files
            * @returns
            */
          async sort(files) {
            return files.sort((a, b) => a[1].localeCompare(b[1]));
          }
        },
      },
    },
  }
});
