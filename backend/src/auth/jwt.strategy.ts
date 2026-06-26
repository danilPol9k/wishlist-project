import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getEnv } from '../config/env';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

type JwtPayload = { sub: number; username: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getEnv('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): Promise<User> {
    return this.usersService.findOne({ id: payload.sub });
  }
}
