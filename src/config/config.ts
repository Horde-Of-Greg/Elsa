import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { validateConfigs, validateEnvs, validateSeederConfigs } from './validate';

const CONFIGS_PATH: string = '/config/';

const configPath: string = path.join(CONFIGS_PATH, 'config.json');
const seedConfigPath: string = path.join(CONFIGS_PATH, 'seeder_config.json');

const configFile = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const seedConfigFile = JSON.parse(fs.readFileSync(seedConfigPath, 'utf-8'));

dotenv.config();

export const env = validateEnvs();
export const config = validateConfigs(configFile);
export const seederConfig = validateSeederConfigs(seedConfigFile);
