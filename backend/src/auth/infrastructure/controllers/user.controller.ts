import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { GetUserByIdUseCase } from '../../application/use-cases/GetUserByIdUseCase';
import { LoginUseCase } from 'src/auth/application/use-cases/LoginUserUseCase';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly loginUseCase: LoginUseCase
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    console.log("dto: ", dto);
    return this.registerUserUseCase.execute(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getUserByIdUseCase.execute(id);
  }
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
