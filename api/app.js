import AutoLoad from '@fastify/autoload';
import { config } from 'dotenv';
import fs from 'graceful-fs';

import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Pass --options via CLI arguments in command to enable these options.
export const options = {};

/**
 * @param {Fastify} fastify The fastify instance
 * @param {{}} opts Options passed on startup
 */
export default async function app(fastify, opts) {
  if (fs.existsSync(path.join(dirname, '.env.local'))) {
    config({ path: path.join(dirname, '.env.local'), override: true });
  }

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(dirname, 'plugins'),
    options: { ...opts },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(dirname, 'routes'),
    options: { ...opts },
  });
}
