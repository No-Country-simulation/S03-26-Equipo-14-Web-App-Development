import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserRepository, PrismaModule } from '@repo/api';
import { TagRepository } from '@repo/api/src/repositories/tag.repository';
import { TagModule } from './tags/tag.module';

@Module({
  imports: [
    AuthModule,
    TagModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    UserRepository,
    TagRepository,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
