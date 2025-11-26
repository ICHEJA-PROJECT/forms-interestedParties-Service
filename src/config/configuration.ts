import 'dotenv/config';
import { envsSchema } from './schemas/env.schema';
import { EnvVars } from './interfaces/env-vars.interface';

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.HTTP_PORT,
  nodeEnv: envVars.NODE_ENV,
  cors: {
    origins: envVars.CORS_ORIGINS.split(','),
  },
  database: {
    name: envVars.DB_NAME,
    port: envVars.DB_PORT,
    host: envVars.DB_HOST,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  rateLimit: {
    ttl: envVars.RATE_LIMIT_TTL,
    limit: envVars.RATE_LIMIT_MAX,
  },
};
