import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Role } from '../enum/role.enum';
import { jwtConstants } from '../constant/constants';
import { JwtStrategy } from '../strategy/jwt-strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      console.log('auth header:', authHeader);
      if (!authHeader) {
        return false;
      }
      const token = authHeader.replace('Bearer ', '');
      console.log('token::', token);
      // const decoded = this.jwtService.verify(token, {
      //   secret: jwtConstants.secret,
      // });
      const decoded = JwtStrategy.decode(token);
      console.log('decode:', decoded);
      // const userRoles = decoded.roles;
      const userRoles = JwtStrategy.getUserRole(request.headers);
      console.log('userRoles::', userRoles);
      return requiredRoles.some((role) => userRoles?.includes(role));
    } catch (err) {
      return false;
    }
  }
}
