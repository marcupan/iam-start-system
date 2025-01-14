import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return a valid JWT token on login', async () => {
    const mockUser = { userId: 1, username: 'testuser', roles: ['user'] };
    const token = await authService.login(mockUser);

    expect(token).toHaveProperty('access_token');
    expect(typeof token.access_token).toBe('string');
  });
});
