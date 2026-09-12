import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';

type AuthUser = {
  _id: string;
  email: string;
  pseudonym: string;
  roles: string[];
  avatar?: string;
  bio?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.usersService.validatePassword(user, password))) {
      return this.serializeUser(user);
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user._id);

    return this.generateTokens(user);
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const serialized = this.serializeUser(user);

    await this.usersService.updateLastLogin(serialized._id);

    return this.generateTokens(serialized);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          process.env.JWT_SECRET ||
          'your-super-secret-jwt-key-change-in-production',
      });

      const user = await this.usersService.findById(payload.sub);
      return this.generateTokens(this.serializeUser(user));
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    return this.serializeUser(user);
  }

  private serializeUser(user: User | Record<string, any>): AuthUser {
    const obj =
      typeof (user as any).toObject === 'function'
        ? (user as any).toObject()
        : user;
    const id = obj._id?.toString?.() ?? String(obj._id ?? obj.id ?? '');

    return {
      _id: id,
      email: obj.email,
      pseudonym: obj.pseudonym,
      roles: obj.roles,
      avatar: obj.avatar,
      bio: obj.bio,
    };
  }

  private generateTokens(user: AuthUser) {
    const payload = {
      email: user.email,
      sub: user._id,
      roles: user.roles,
      pseudonym: user.pseudonym,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      }),
      user,
    };
  }
}
