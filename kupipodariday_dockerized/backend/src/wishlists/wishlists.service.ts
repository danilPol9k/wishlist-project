import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist) private readonly wishlists: Repository<Wishlist>,
    @InjectRepository(Wish) private readonly wishes: Repository<Wish>,
  ) {}

  async create(dto: CreateWishlistDto, owner: User): Promise<Wishlist> {
    const items = dto.itemsId?.length ? await this.wishes.find({ where: { id: In(dto.itemsId) } }) : [];
    const wishlist = await this.wishlists.save(this.wishlists.create({ ...dto, items, owner }));
    return this.findOne({ id: wishlist.id });
  }

  findMany(): Promise<Wishlist[]> {
    return this.wishlists.find({ relations: { owner: true, items: true } });
  }

  async findOne(query: Partial<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.wishlists.findOne({ where: query, relations: { owner: true, items: true } });
    if (!wishlist) throw new NotFoundException('Подборка не найдена');
    return wishlist;
  }

  async updateOne(id: number, dto: UpdateWishlistDto, user: User): Promise<Wishlist> {
    const wishlist = await this.findOne({ id });
    if (wishlist.owner.id !== user.id) throw new ForbiddenException('Можно редактировать только свои подборки');
    const items = dto.itemsId ? await this.wishes.find({ where: { id: In(dto.itemsId) } }) : wishlist.items;
    await this.wishlists.save({ ...wishlist, ...dto, items });
    return this.findOne({ id });
  }

  async removeOne(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.findOne({ id });
    if (wishlist.owner.id !== user.id) throw new ForbiddenException('Можно удалять только свои подборки');
    await this.wishlists.delete(id);
    return wishlist;
  }
}
