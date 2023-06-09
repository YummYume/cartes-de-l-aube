import { readdir } from 'fs/promises';
import path from 'path';

const schemaPath = path.resolve('typeorm/schema');

export const mongodb = {
  type: process.env.MONGODB_TYPE || 'mongodb',
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  host: process.env.MONGODB_HOST,
  port: process.env.MONGODB_PORT || 27017,
};

export const typeorm = {
  type: 'mysql',
  username: process.env.MARIADB_USERNAME,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  port: process.env.MARIADB_PORT,
  host: process.env.MARIADB_HOST,

  // Dynamic module import for schemaEntity
  entities: await Promise.all(
    [...(await readdir(schemaPath))]
      .filter((file) => !file.includes('_'))
      .map(async (file) => {
        const module = await import(path.join(schemaPath, file));
        return module.default;
      })
  ),
  synchronize: true,
};

export const env = {
  secretKey: process.env.SECRET || 'need-to-add-a-secret-key',
  saltFactor: process.env.salt || 14,
  cookie: {
    name: 'token',
    secretKey: process.env.SECRET || 'need-to-add-a-cookie-key',
    config: {
      domain: process.env.DOMAIN_API || 'api.carte.local',
      path: '/',
      secure: false,
      httpOnly: true,
      sameSite: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  helmet: {},
};
