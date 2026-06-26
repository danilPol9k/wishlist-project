import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { OffersModule } from './offers/offers.module';
import { getEnv, getEnvNumber } from './config/env';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: getEnv('POSTGRES_HOST'),
      port: getEnvNumber('POSTGRES_PORT', 5432),
      username: getEnv('POSTGRES_USER'),
      password: getEnv('POSTGRES_PASSWORD'),
      database: getEnv('POSTGRES_DB'),
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    WishesModule,
    OffersModule,
    WishlistsModule,
    AuthModule,
  ],
})
export class AppModule {}
