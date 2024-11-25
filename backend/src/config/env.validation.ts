// backend/src/config/env.validation.ts
import { cleanEnv, str, port, url } from 'envalid';

export const validateEnv = () => {
  return cleanEnv(process.env, {
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    DB_HOST: str(),
    JWT_SECRET: str(),
    STRIPE_KEY: str(),
    REDIS_HOST: str(),
    REDIS_PORT: port(),
    PORT: port(),
    NODE_ENV: str(),
    FRONTEND_URL: url()
  });
};