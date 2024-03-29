import { readdir } from 'fs/promises';
import path from 'path';

const schemaPath = path.resolve('typeorm/schema');

export const mongodb = {
  type: process.env.MONGODB_TYPE || 'mongodb',
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  host: process.env.MONGODB_HOST,
  port: process.env.MONGODB_PORT || 27017,
  database: { test: 'test', development: 'db', production: 'db-prod' }[process.env.ENV],
};

export const typeorm = {
  type: 'mysql',
  username: process.env.MARIADB_USERNAME,
  password: process.env.MARIADB_PASSWORD,
  database: {
    test: 'test',
    development: process.env.MARIADB_DATABASE,
    production: process.env.MARIADB_DATABASE,
  }[process.env.ENV],
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
  synchronize: false,
  migrations: [path.resolve('typeorm/migrations/*.js')],
  migrationsRun: true,
};

export const env = {
  secretKey: process.env.SECRET || 'eshbfuiesuibsb2uh4vhj23h4jvb2h4',
  tokenExpireIn: '1d',
  refreshTokenExpireIn: '7d',
  saltFactor: process.env.salt || 14,
  cookie: {
    name: 'token',
    secretKey: process.env.SECRET || '8rf8b8erg34uhg23489gh28g89h2gh328',
    config: {
      domain: process.env.DOMAIN_API || 'api.carte.local',
      path: '/',
      secure: process.env.ENV === 'production',
      httpOnly: true,
      sameSite: process.env.ENV === 'production' ? `none` : `lax`,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  helmet: {},
};
