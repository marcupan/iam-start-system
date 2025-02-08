jest.unmock('bcrypt');

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUsersService = {
      findOneByUsername: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock.jwt.token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  beforeEach(() => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(async (plain, hashed) => {
      return plain === 'securePassword123' && hashed === 'hashedPassword123';
    });

    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue(
      'hashedPassword123',
    );
  });

  describe('validateUser', () => {
    it('should return null if credentials are invalid', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);

      const result = await authService.validateUser(
        'nonexistentuser',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });
});
