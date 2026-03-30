import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const schemaEnv = z.object({
  //environment
  NODE_ENV: z.string().default('development'),
  //cms-api
  JWT_SECRET: z.string(),
  JWT_RESET_TOKEN_SECRET: z.string(),

  PORT: z.string().default('3000'),
  //cms-app
  NEXT_PUBLIC_API_URL: z.string(),

  //mail
  SGMAIL_TOKEN: z.string(),

  //Prisma
  PRISMA_LOGS: z.string(),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
});

const globalEnv = schemaEnv.parse(process.env);
export default globalEnv;
