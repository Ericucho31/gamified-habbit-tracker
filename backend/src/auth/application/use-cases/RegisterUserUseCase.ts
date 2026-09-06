import { Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../../../generated/prisma';
import { PasswordService } from '../common/PasswordService';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService
  ) { }

  async execute(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException(`User with email ${data.email} already exists`);
    }

    const hashedPassword = await this.passwordService.hashPassword(data.password);
    data.password = hashedPassword;

    console.log(data);

    return this.userRepository.create(data);
  }
}
