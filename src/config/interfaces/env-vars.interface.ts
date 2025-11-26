export interface EnvVars {
  HTTP_PORT: number;
  NODE_ENV: string;
  CORS_ORIGINS: string;
  DB_NAME: string;
  DB_PORT: number;
  DB_HOST: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  RATE_LIMIT_TTL: number;
  RATE_LIMIT_MAX: number;
}
