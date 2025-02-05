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
    // ✅ Ensure `bcrypt.compare` is always mocked before each test
    jest.spyOn(bcrypt, 'compare').mockImplementation(async (plain, hashed) => {
      return plain === 'securePassword123' && hashed === 'hashedPassword123';
    });

    // ✅ Ensure `bcrypt.hash` is mocked
    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue(
      'hashedPassword123',
    );
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword123',
        roles: ['user'],
      };

      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(mockUser);

      const result = await authService.validateUser(
        'testuser',
        'securePassword123',
      );

      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        roles: ['user'],
      });
    });

    it('should return null if credentials are invalid', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);

      const result = await authService.validateUser(
        'nonexistentuser',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('verifyPassword', () => {
    it('should return true for valid password', async () => {
      const result = await authService['verifyPassword'](
        'securePassword123',
        'hashedPassword123',
      );

      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const result = await authService['verifyPassword'](
        'wrongPassword',
        'hashedPassword123',
      );

      expect(result).toBe(false);
    });
  });
});
