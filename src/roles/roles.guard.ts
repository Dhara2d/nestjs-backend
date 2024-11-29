// auth-roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './roles.enum';

@Injectable()
export class AuthRolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, use the AuthGuard to authenticate the request
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false; // If the user is not authenticated, deny access
    }

    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true; // If no roles are specified, allow the request (any authenticated user)
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // This contains the user info (including roles) from the JWT payload

    console.log(user, roles);
    // Check if the user has at least one of the required roles
    if (!user || !roles.some((role) => user.role?.includes(role))) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
