/* eslint-disable no-console */
import chalk from 'chalk';
import dotenv from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import fs from 'graceful-fs';
import mongoose from 'mongoose';

import path from 'path';

import { mongodb } from '../config/config.js';
import { findOperatorArts, getOperators } from '../lib/api.js';
import { Operator } from '../mongoose/models/Operator.js';

try {
  console.info(chalk.blue('Loading env variables...'));

  // Load .env, .env.local and check if necessary variables are set
  dotenv.config();

  if (fs.existsSync(path.join(process.cwd(), '.env.local'))) {
    dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: true });
  }

  const requiredEnvs = [
    'MONGODB_USERNAME',
    'MONGODB_PASSWORD',
    'MONGODB_HOST',
    'ARKNIGHTS_API_HOST',
    'ENV',
  ];

  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      throw new Error(`Env variable "${env}" is missing.`);
    }
  }

  console.info(chalk.green('Env variables loaded successfully!'));
} catch (err) {
  console.error(chalk.red('Error while loading env variables: ') + chalk.bgRed(err));
  console.dir(err);

  process.exit(1);
}

try {
  const database = { test: 'test', development: 'db', production: 'db-prod' }[process.env.ENV];

  await mongoose.connect(`${mongodb.type}://${mongodb.host}:${mongodb.port}/${database}`, {
    authSource: 'admin',
    user: mongodb.username,
    pass: mongodb.password,
  });
} catch (err) {
  console.error(chalk.red('Error while connecting to MongoDB: ') + chalk.bgRed(err));
  console.dir(err);

  process.exit(1);
}

let hasError = false;
let updateCount = 0;
let failedCount = 0;

try {
  console.log(chalk.blue('Getting operators...'));

  const operators = await getOperators();

  console.log(
    chalk.blue(`Syncing ${operators.length} operator${operators.length > 1 ? 's' : ''}...`)
  );

  for (const operator of operators) {
    try {
      const arts = await findOperatorArts(operator);

      await Operator.updateOne(
        { name: operator.name },
        { ...operator, art: arts ?? operator.art },
        { upsert: true }
      );

      console.log(chalk.green(`Operator "${operator.name}" synced successfully.`));

      updateCount += 1;
    } catch (err) {
      console.error(
        chalk.red(`Error while syncing operator "${operator.name}": `) + chalk.bgRed(err)
      );
      console.dir(err);

      failedCount += 1;
    }
  }

  if (updateCount > 0) {
    console.log(
      chalk.green(`Synced ${updateCount} operator${updateCount > 1 ? 's' : ''} successfully.`)
    );
  }

  if (failedCount > 0) {
    console.log(chalk.red(`Failed to sync ${failedCount} operator${failedCount > 1 ? 's' : ''}.`));
  }
} catch (err) {
  console.error(chalk.red('Error while syncing operators: ') + chalk.bgRed(err));
  console.dir(err);
  hasError = true;
} finally {
  await mongoose.disconnect();

  process.exit(hasError ? 1 : 0);
}
