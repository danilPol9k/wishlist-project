import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HidePasswordInterceptor } from '../common/interceptors/hide-password.interceptor';
import { User } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';

@Controller('offers')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(HidePasswordInterceptor)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() dto: CreateOfferDto, @CurrentUser() user: User): Promise<Offer> {
    return this.offersService.create(dto, user);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findOne(Number(id));
  }
}
