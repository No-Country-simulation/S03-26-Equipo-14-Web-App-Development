import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import globalEnv from '@repo/env';
import { UserRepository } from '@repo/api';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  console.log('NODE_ENV', globalEnv.NODE_ENV);
  const app = await NestFactory.create(AppModule);
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
  //test repo/api
  const userRepo = app.get(UserRepository);
  const user = await userRepo.find();
  console.log('test', user);

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
  app.use(cookieParser());
  app.enableCors();
  await app.listen(3000);
}

void bootstrap();
