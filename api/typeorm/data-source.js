import mysql from 'mysql2/promise';
import { DataSource } from 'typeorm';

import { typeorm } from '../config/config.js';

export default () => new DataSource(typeorm);

/**
 * @param {Fastify} fastify
 */
export const createDatabase = async (fastify) => {
  try {
    fastify.log.info('MySQL: Connecting to create database');

    const connection = await mysql.createConnection({
      user: typeorm.username,
      password: typeorm.password,
      host: typeorm.host,
      port: typeorm.port,
      namedPlaceholders: true,
    });

    fastify.log.info('MySQL: Connected');

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${typeorm.database};`);

    fastify.log.info(`MySQL: "${typeorm.database}" Database created or successfully checked`);

    await connection.end();

    fastify.log.info('MySQL: Connection closed');
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * @param {Fastify} fastify
 */
export const dropDatabase = async (fastify) => {
  try {
    fastify.log.info('MySQL: Connecting to drop database');

    const connection = await mysql.createConnection({
      user: typeorm.username,
      password: typeorm.password,
      host: typeorm.host,
      port: typeorm.port,
      namedPlaceholders: true,
    });

    fastify.log.info('MySQL: Connected');

    await connection.query(`DROP DATABASE IF EXISTS ${typeorm.database};`);

    fastify.log.info(`MySQL: "${typeorm.database}" Database dropped or not exists`);

    await connection.end();

    fastify.log.info('MySQL: Connection closed');
  } catch (err) {
    throw new Error(err);
  }
};
