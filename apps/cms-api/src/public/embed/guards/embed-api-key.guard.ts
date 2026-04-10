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

    if (typeof apikey !== 'string')
      throw new UnauthorizedException('Invalid embed key');
    const parts = apikey.split(':');
    if (parts[0] === 'cms-api-key')
      throw new UnauthorizedException('Invalid embed key Format');

    try {
      const { projectId, orgId } = await this.crypto.decodeApiKey(apikey);

      if (!projectId || !orgId) throw new Error();

      req.embedCredentials = { projectId, orgId };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid embed key');
    }
  }
}
