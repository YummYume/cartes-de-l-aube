// This file contains code that we reuse
// between our tests.

import helper from 'fastify-cli/helper.js';

import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const AppPath = path.join(dirname, '..', 'app.js');

// Fill in this config with all the configurations
// needed for testing the application
/**
 * @returns {{}}
 */
function config() {
  return {};
}

// automatically build and tear down our instance
/**
 * @returns {any}
 * @param {any} t
 */
async function build(t) {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath];

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, config());

  // tear down our app after we are done
  t.teardown(app.close.bind(app));

  return app;
}

export { config, build };
