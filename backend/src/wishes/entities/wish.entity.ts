import { IsInt, IsNumber, IsString, IsUrl, Length, Min } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';

@Entity('wishes')
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column('numeric', { precision: 10, scale: 2, transformer: { to: (v: number) => v, from: (v: string) => Number(v) } })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0, transformer: { to: (v: number) => v, from: (v: string) => Number(v) } })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes, { eager: true, onDelete: 'CASCADE' })
  owner: User;

  @Column({ length: 1024 })
  @IsString()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsInt()
  copied: number;
}
