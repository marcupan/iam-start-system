import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockUserRepository: Partial<jest.Mocked<Repository<User>>> = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User),
    ) as jest.Mocked<Repository<User>>;
  });

  describe('create', () => {
    it('should create and return a new user when username is available', async () => {
      const createUserDto = {
        username: 'newuser',
        password: 'securePassword123',
        roles: ['user'],
      };

      const mockNewUser: User = {
        id: 1,
        username: 'newuser',
        roles: ['user'],
        password: 'hashedPassword123',
      };

      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockResolvedValue(undefined);
      jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue('hashedPassword123' as never);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockNewUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockNewUser);

      const result = await usersService.create(createUserDto);
      expect(result).toEqual(mockNewUser);
      expect(usersService.findOneByUsername).toHaveBeenCalledWith('newuser');
      expect(bcrypt.hash).toHaveBeenCalledWith('securePassword123', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'hashedPassword123',
        roles: ['user'],
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockNewUser);
    });
  });
});
