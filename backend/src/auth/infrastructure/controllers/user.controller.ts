import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { GetUserByIdUseCase } from '../../application/use-cases/GetUserByIdUseCase';
import { RegisterUserDto } from '../dtos/register-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.registerUserUseCase.execute(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getUserByIdUseCase.execute(id);
  }
}
