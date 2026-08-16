import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import env from '@repo/env';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.CMS_ACCESS_TOKEN ?? null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload.sub) throw new UnauthorizedException('Invalid token');

    return payload;
  }
}
