import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const schemaEnv = z.object({
  //environment
  NODE_ENV: z.string().default('development'),
  //External Services
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_UPLOAD_PRESET: z.string(),

  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_ID_CLIENT: z.string(),
  YOUTUBE_API_KEY: z.string(),

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

const result = schemaEnv.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment variables', result.error.format());
  throw new Error('Invalid environment variables');
}

const globalEnv = result.data;
export default globalEnv;
