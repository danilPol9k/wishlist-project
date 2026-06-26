import { IsBoolean, IsNumber, Min } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, { eager: true, onDelete: 'CASCADE' })
  item: Wish;

  @Column('numeric', { precision: 10, scale: 2, transformer: { to: (v: number) => v, from: (v: string) => Number(v) } })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
