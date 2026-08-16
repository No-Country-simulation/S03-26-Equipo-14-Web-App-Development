import cors from 'cors';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import globalEnv from '@repo/env';
import { UserRepository } from '@repo/api';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './api/common/interceptors/response.interceptor';

const { DEV_LOCAL_APP_URL, DEV_DEPLOY_APP_URL, PROD_DEPLOY_APP_URL } =
  globalEnv;

const corsOptions = {
  origin: [DEV_LOCAL_APP_URL, DEV_DEPLOY_APP_URL, PROD_DEPLOY_APP_URL],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization',
};

async function bootstrap() {
  console.log('NODE_ENV', globalEnv.NODE_ENV);
  const app = await NestFactory.create(AppModule, { cors: false });

  app.use(
    '/embed',
    cors({
      origin: true,
      methods: 'GET,HEAD,POST',
      credentials: false,
      allowedHeaders: 'Content-type, X-Embed-Key',
    }),
  );

  app.use(cors(corsOptions));

  app.use(cookieParser());

  //response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  //pipe for input data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //Swagger documentation config
  const config = new DocumentBuilder()
    .setTitle('CMS API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addTag('CMS')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(3000);
}

void bootstrap();
