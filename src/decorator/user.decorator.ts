import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtStrategy } from '../strategy/jwt-strategy';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return JwtStrategy.getPayload(request.headers);
  },
);
