import { Body, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HidePasswordInterceptor } from '../common/interceptors/hide-password.interceptor';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';

@Controller()
@UseInterceptors(HidePasswordInterceptor)
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto): Promise<User> {
    return this.auth.signup(dto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  signin(@Req() req: { user: User }): { access_token: string } {
    return this.auth.login(req.user);
  }
}
