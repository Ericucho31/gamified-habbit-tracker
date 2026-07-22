import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../../../generated/prisma';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
