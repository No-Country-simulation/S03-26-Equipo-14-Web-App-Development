import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import env from "@repo/env";
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: "jwt"
        }),
        JwtModule.registerAsync({
            global: true,            
            useFactory: () => ({
                secret: env.JWT_SECRET,
                signOptions: {expiresIn: "1d"}
            })
        }),    
            
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService]
})
export class AuthModule {}
