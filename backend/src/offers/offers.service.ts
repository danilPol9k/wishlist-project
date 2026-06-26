import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private readonly offers: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, user: User): Promise<Offer> {
    const wish = await this.wishesService.findOne({ id: dto.itemId });
    if (wish.owner.id === user.id) throw new ForbiddenException('Нельзя скидываться на собственный подарок');
    if (Number(wish.raised) >= Number(wish.price)) throw new BadRequestException('На подарок уже собраны деньги');
    if (Number(wish.raised) + Number(dto.amount) > Number(wish.price)) {
      throw new BadRequestException('Сумма собранных средств не может превышать стоимость подарка');
    }

    const offer = await this.offers.save(
      this.offers.create({ user, item: wish, amount: dto.amount, hidden: dto.hidden ?? false }),
    );
    await this.wishesService.addRaised(wish.id, dto.amount);
    return this.findOne(offer.id);
  }

  findMany(): Promise<Offer[]> {
    return this.offers.find({ relations: { user: true, item: { owner: true } } });
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offers.findOne({
      where: { id },
      relations: { user: true, item: { owner: true } },
    });
    if (!offer) throw new NotFoundException('Заявка не найдена');
    return offer;
  }
}
