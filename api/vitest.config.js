import { defineConfig } from 'vitest/config'
import { BaseSequencer } from 'vitest/node';

export default defineConfig({
  test: {
    include: ['test/**/*.{test,spec}.js'],
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
});
