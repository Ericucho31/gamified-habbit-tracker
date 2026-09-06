import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { RegisterUserUseCase } from './application/use-cases/RegisterUserUseCase';
import { GetUserByIdUseCase } from './application/use-cases/GetUserByIdUseCase';
import { IUserRepository } from './application/interfaces/IUserRepository';
import { PrismaUserRepository } from './infrastructure/persistence/PrismaUserRepository';
import { PasswordService } from './application/common/PasswordService';
import { LoginUseCase } from './application/use-cases/LoginUserUseCase';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    RegisterUserUseCase,
    GetUserByIdUseCase,
    PasswordService,
    LoginUseCase
  ],
  exports: [IUserRepository],
})
export class AuthModule { }
