import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwt: JwtService) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsernameWithPassword(username);
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Неверные имя пользователя или пароль');
    return user;
  }

  async signup(dto: CreateUserDto): Promise<User> { return this.usersService.create(dto); }

  login(user: User): { access_token: string } {
    return { access_token: this.jwt.sign({ sub: user.id, username: user.username }) };
  }
}
