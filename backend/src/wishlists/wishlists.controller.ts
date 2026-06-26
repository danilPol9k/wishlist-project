import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HidePasswordInterceptor } from '../common/interceptors/hide-password.interceptor';
import { User } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
@UseInterceptors(HidePasswordInterceptor)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findMany();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateWishlistDto, @CurrentUser() user: User): Promise<Wishlist> {
    return this.wishlistsService.create(dto, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistsService.findOne({ id: Number(id) });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() dto: UpdateWishlistDto, @CurrentUser() user: User): Promise<Wishlist> {
    return this.wishlistsService.updateOne(Number(id), dto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @CurrentUser() user: User): Promise<Wishlist> {
    return this.wishlistsService.removeOne(Number(id), user);
  }
}
