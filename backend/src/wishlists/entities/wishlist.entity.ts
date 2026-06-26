import { IsString, IsUrl, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity('wishlists')
export class Wishlist {
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

  @Column({ length: 1500, default: '' })
  @IsString()
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, { eager: true })
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists, { eager: true, onDelete: 'CASCADE' })
  owner: User;
}
