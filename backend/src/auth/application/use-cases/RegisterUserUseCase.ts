import { Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../../../generated/prisma';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException(`User with email ${data.email} already exists`);
    }

    // In a real application, you would hash the password here (e.g., using bcrypt or argon2)
    // const hashedPassword = await bcrypt.hash(data.password, 10);
    // data.password = hashedPassword;

    return this.userRepository.create(data);
  }
}
