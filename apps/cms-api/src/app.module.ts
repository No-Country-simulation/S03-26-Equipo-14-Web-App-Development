import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [LinksModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../../.env"
    }),
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, {provide: APP_GUARD, useClass: JwtAuthGuard}],
})
export class AppModule {}
