import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EmbedService } from '../embed.service';
import { Observable } from 'rxjs';

@Injectable()
export class EmbedApiKeyGuard implements CanActivate {
  constructor(private readonly crypto: EmbedService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const apikey = req.headers['x-embed.key'] ?? req.query.key;

    if (!apikey) throw new UnauthorizedException('Missing embed key');

    try {
      const { projectId, orgId } = await this.crypto.decodeApiKey(apikey);
      req.embedCredentials = { projectId, orgId };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid embed key');
    }
  }
}
