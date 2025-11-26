import * as joi from 'joi';
import { EnvVars } from '../interfaces/env-vars.interface';

export const envsSchema = joi
  .object<EnvVars>({
    HTTP_PORT: joi.number().default(3000),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development'),
    CORS_ORIGINS: joi.string().default('http://localhost:3000'),
    DB_NAME: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    JWT_SECRET: joi.string().required().min(32),
    JWT_EXPIRES_IN: joi.string().default('1h'),
    RATE_LIMIT_TTL: joi.number().default(60000),
    RATE_LIMIT_MAX: joi.number().default(50),
  })
  .unknown(true);
