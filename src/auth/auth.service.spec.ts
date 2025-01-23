import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../user/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const mockUsersService = {
      findOneByUsername: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const mockUser = {
        id: 1, // Ensure `id` is included
        username: 'testuser',
        password: await bcrypt.hash('securePassword123', 10),
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
      const plainTextPassword = 'securePassword123';
      const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

      const result = await authService['verifyPassword'](
        plainTextPassword,
        hashedPassword,
      );

      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const plainTextPassword = 'wrongPassword';
      const hashedPassword = await bcrypt.hash('securePassword123', 10);

      const result = await authService['verifyPassword'](
        plainTextPassword,
        hashedPassword,
      );

      expect(result).toBe(false);
    });
  });
});
