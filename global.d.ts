import { Request, Express } from 'express';

declare global {
  type AnyObject = Record<string, unknown>;

  type DeepPartial<T> = T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

  namespace Express {
    interface User {
      id: string,
      username: string
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: number;
      DATABASE_URL: string;
      SECRET_KEY: string;
    }
  }
}

export default global;