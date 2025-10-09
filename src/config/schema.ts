import z from 'zod';
import { ConfigFileSchema, EnvFileSchema, SeederConfigFileSchema } from './fileSchema';

export const EnvSchema = EnvFileSchema;

export const ConfigSchema = ConfigFileSchema.transform((f) => ({
    PREFIX: f.prefix,
    NAME: f.name,
    CMD_RANKS: { TAG: f.cmdRanks.tag, ADD_TAG: f.cmdRanks.addTag, SET_RANK: f.cmdRanks.setRank },
}));

export const SeederConfigSchema = SeederConfigFileSchema.transform((f) => ({
    DEPTH: f.depth,
}));

export type Env = z.infer<typeof EnvSchema>;
export type Config = z.infer<typeof ConfigSchema>;
export type SeederConfig = z.infer<typeof SeederConfigSchema>;
