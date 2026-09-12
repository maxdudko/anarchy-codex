import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    // return super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      console.log({token})
      const payload = await this.jwtService.verifyAsync(token, {
        secret:
          process.env.JWT_SECRET ||
          'your-super-secret-jwt-key-change-in-production',
      });
      console.log({ payload });
      request.user = payload.user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    console.log({ user });
    return user;
  }
}
