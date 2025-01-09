import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) return false;

    const token = authorizationHeader.split(' ')[1];

    try {
      const user = await this.jwtService.verifyAsync(token);
      request.user = user;
      return user;
    } catch {
      return false;
    }
  }
}
