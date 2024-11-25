// backend/src/config/environment.ts
import { validateEnv } from './env.validation';
import dotenv from 'dotenv';

export class Environment {
  private static instance: Environment;
  private env: ReturnType<typeof validateEnv>;

  private constructor() {
    // Load environment variables based on NODE_ENV
    const envFile = process.env.NODE_ENV === 'production' 
      ? '.env.production' 
      : '.env.development';
    
    dotenv.config({ path: envFile });
    this.env = validateEnv();
  }

  static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  get config() {
    return {
      database: {
        user: this.env.DB_USER,
        password: this.env.DB_PASSWORD,
        name: this.env.DB_NAME,
        host: this.env.DB_HOST
      },
      jwt: {
        secret: this.env.JWT_SECRET
      },
      stripe: {
        key: this.env.STRIPE_KEY
      },
      redis: {
        host: this.env.REDIS_HOST,
        port: this.env.REDIS_PORT
      },
      app: {
        port: this.env.PORT,
        nodeEnv: this.env.NODE_ENV,
        frontendUrl: this.env.FRONTEND_URL
      }
    };
  }
}