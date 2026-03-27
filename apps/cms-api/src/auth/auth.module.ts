import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import globalEnv from "@repo/env";
import { UserRepository } from '@repo/api';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [
        MailModule,
        PassportModule.register({
            defaultStrategy: "jwt"
        }),
        JwtModule.registerAsync({
            global: true,            
            useFactory: () => ({
                secret: globalEnv.JWT_SECRET,
                signOptions: {expiresIn: "1d"}
            })
        }),                
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository]
})
export class AuthModule {}
