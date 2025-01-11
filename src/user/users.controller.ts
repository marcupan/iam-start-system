import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './roles/roles.enum';

@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Get()
  async getUsers() {
    return this.usersService.findAll();
  }

  @Roles(Role.Admin, Role.User)
  @Post()
  async createUser(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }
}
