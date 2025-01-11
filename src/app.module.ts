import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { DatabaseModule } from './database/database.module';
import { MongoDbModule } from './mongodb/mongodb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MongoDbModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
