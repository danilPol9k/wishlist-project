import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(@InjectRepository(Wish) private readonly wishes: Repository<Wish>) {}

  create(dto: CreateWishDto, owner: User): Promise<Wish> {
    return this.wishes.save(this.wishes.create({ ...dto, owner, raised: 0, copied: 0 }));
  }

  async findOne(query: Partial<Wish>): Promise<Wish> {
    const wish = await this.wishes.findOne({
      where: query,
      relations: { owner: true, offers: { user: true } },
    });
    if (!wish) throw new NotFoundException('Подарок не найден');
    return wish;
  }

  findMany(): Promise<Wish[]> {
    return this.wishes.find({ relations: { owner: true, offers: { user: true } }, order: { createdAt: 'DESC' } });
  }

  findLast(): Promise<Wish[]> {
    return this.wishes.find({ relations: { owner: true }, order: { createdAt: 'DESC' }, take: 40 });
  }

  findTop(): Promise<Wish[]> {
    return this.wishes.find({ relations: { owner: true }, order: { copied: 'DESC' }, take: 10 });
  }

  async updateOne(id: number, dto: UpdateWishDto, user: User): Promise<Wish> {
    const wish = await this.findOne({ id });
    if (wish.owner.id !== user.id) throw new ForbiddenException('Нельзя редактировать чужой подарок');
    if (dto.price !== undefined && wish.raised > 0) {
      throw new BadRequestException('Нельзя менять стоимость, если уже есть желающие скинуться');
    }
    await this.wishes.update(id, dto);
    return this.findOne({ id });
  }

  async removeOne(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne({ id });
    if (wish.owner.id !== user.id) throw new ForbiddenException('Нельзя удалить чужой подарок');
    if (wish.raised > 0) throw new BadRequestException('Нельзя удалить подарок, на который уже скинулись');
    await this.wishes.delete(id);
    return wish;
  }

  async copy(id: number, user: User): Promise<Wish> {
    const original = await this.findOne({ id });
    original.copied += 1;
    await this.wishes.save(original);
    return this.create(
      {
        name: original.name,
        link: original.link,
        image: original.image,
        price: original.price,
        description: original.description,
      },
      user,
    );
  }

  async addRaised(id: number, amount: number): Promise<Wish> {
    const wish = await this.findOne({ id });
    wish.raised = Number((Number(wish.raised) + Number(amount)).toFixed(2));
    return this.wishes.save(wish);
  }
}
