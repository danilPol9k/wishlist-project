import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HidePasswordInterceptor } from '../common/interceptors/hide-password.interceptor';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';

@Controller('wishes')
@UseInterceptors(HidePasswordInterceptor)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateWishDto, @CurrentUser() user: User): Promise<Wish> {
    return this.wishesService.create(dto, user);
  }

  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishesService.findTop();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string): Promise<Wish> {
    return this.wishesService.findOne({ id: Number(id) });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() dto: UpdateWishDto, @CurrentUser() user: User): Promise<Wish> {
    return this.wishesService.updateOne(Number(id), dto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @CurrentUser() user: User): Promise<Wish> {
    return this.wishesService.removeOne(Number(id), user);
  }

  @Post(':id/copy')
  @UseGuards(AuthGuard('jwt'))
  copy(@Param('id') id: string, @CurrentUser() user: User): Promise<Wish> {
    return this.wishesService.copy(Number(id), user);
  }
}
