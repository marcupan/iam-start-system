import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UsersModule), // Use forwardRef for circular dependency
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule], // Export JwtModule and AuthService
})
export class AuthModule {}
