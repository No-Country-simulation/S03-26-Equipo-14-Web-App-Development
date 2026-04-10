import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const EmbedCredentials = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.embedCredentials;
  },
);
