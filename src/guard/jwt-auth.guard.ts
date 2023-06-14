import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  ExecutionContext,
  SetMetadata,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/strategy/jwt-strategy';
import { ROLES_KEY } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';

const keyPublicRoute = 'isPublic';
export const ONLY_OWNER_ORG = 'ONLY_OWNER_ORG';
@Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  private async validateRequest(request, context): Promise<boolean> {
    const headers = request.headers;
    const token = headers.authorization || null;
    if (!token) return false;
    const payload: any = JwtStrategy.decode(token);
    console.log('payload', payload);
    if (!payload) {
      throw new UnauthorizedException('Token is not in the correct format!');
    }
    const endPointRoles: any[] = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    console.log('endPointRoles', endPointRoles);
    if (endPointRoles) {
      {
        if (!endPointRoles.some((role) => role === payload.roles)) {
          throw new ForbiddenException(
            `Role ${payload.roles} cannot be access`,
          );
        }
      }
    }
    try {
      const { secret } = await this.prisma.user.findUnique({
        where: {
          id: payload.id,
        },
        select: {
          secret: true,
        },
      });
      console.log('secret:', secret);
      const verify = JwtStrategy.verify(token, secret);
      console.log('verify:', verify);
      return true;
    } catch (error) {
      throw new UnauthorizedException('lỗi ở đây đúng không!');
    }
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.get(keyPublicRoute, context.getHandler())) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const validateRequest = await this.validateRequest(request, context);
    if (!validateRequest) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
export const Public = () => SetMetadata(keyPublicRoute, true);
