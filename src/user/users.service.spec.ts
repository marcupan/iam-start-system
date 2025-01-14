import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUserRepo: any;

  beforeEach(async () => {
    mockUserRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should hash the password before saving a user', async () => {
    const createUserDto = {
      username: 'testuser',
      password: 'securePassword123',
      roles: ['user'],
    };

    await usersService.create(createUserDto);
    expect(mockUserRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'testuser',
        roles: ['user'],
      }),
    );
    expect(mockUserRepo.save).toHaveBeenCalled();
  });
});
