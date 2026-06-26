import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ILike, QueryFailedError, Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

function isUniqueViolation(error: unknown): boolean {
  return error instanceof QueryFailedError && (error.driverError as { code?: string }).code === '23505';
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash(dto.password, 10);

    try {
      return await this.users.save(this.users.create({ ...dto, password }));
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Пользователь с таким email или username уже существует');
      }
      throw error;
    }
  }

  async findOne(query: Partial<User>): Promise<User> {
    const user = await this.users.findOne({
      where: query,
      relations: { wishes: true, offers: true, wishlists: true },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async findPublicProfile(username: string): Promise<User> {
    const user = await this.users.findOne({ where: { username } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async findByUsernameWithPassword(username: string): Promise<User> {
    const user = await this.users.findOne({ where: { username } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async findWishesByUsername(username: string): Promise<Wish[]> {
    const user = await this.users.findOne({
      where: { username },
      relations: { wishes: { offers: true } },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user.wishes;
  }

  async findMany(query: string): Promise<User[]> {
    return this.users.find({ where: [{ username: ILike(`%${query}%`) }, { email: ILike(`%${query}%`) }] });
  }

  async updateOne(id: number, dto: UpdateUserDto): Promise<User> {
    const current = await this.findOne({ id });
    const password = dto.password ? await bcrypt.hash(dto.password, 10) : current.password;

    try {
      await this.users.update(id, { ...dto, password });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Email или username уже занят');
      }
      throw error;
    }

    return this.findOne({ id });
  }

  async removeOne(id: number): Promise<void> {
    await this.users.delete(id);
  }
}
