import { Body, Controller, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HidePasswordInterceptor } from '../common/interceptors/hide-password.interceptor';
import { Wish } from '../wishes/entities/wish.entity';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(HidePasswordInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: User): Promise<User> {
    return this.usersService.findOne({ id: user.id });
  }

  @Patch('me')
  updateMe(@CurrentUser() user: User, @Body() dto: UpdateUserDto): Promise<User> {
    return this.usersService.updateOne(user.id, dto);
  }

  @Get('me/wishes')
  getOwnWishes(@CurrentUser() user: User): Promise<Wish[]> {
    return this.usersService.findWishesByUsername(user.username);
  }

  @Post('find')
  find(@Body() dto: FindUserDto): Promise<User[]> {
    return this.usersService.findMany(dto.query);
  }

  @Get(':username/wishes')
  getWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.findWishesByUsername(username);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findPublicProfile(username);
  }
}
