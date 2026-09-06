import { Injectable, ConflictException, BadRequestException } from "@nestjs/common";
import { IUserRepository } from "../interfaces/IUserRepository";
import { PasswordService } from "../common/PasswordService";
import { emit } from "process";

@Injectable()
export class LoginUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: PasswordService,
    ) { }

    async execute(data: { email: string, password: string }): Promise<boolean> {
        if (!data.email || !data.password) {
            throw new BadRequestException('Email and password are required');
        }

        const user = await this.userRepository.findByEmail(data.email)

        if (user == null) {
            throw new BadRequestException('Email does not exist');
        }

        const isPasswordValid = await this.passwordService.comparePassword(data.password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException('Email or password are not matching');
        }

        return user != null;
    }
}