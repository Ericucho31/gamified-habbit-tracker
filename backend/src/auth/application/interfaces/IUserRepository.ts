import { User } from "src/generated/prisma";

export abstract class IUserRepository {
    abstract findById(id: string): Promise<User | null>;
    abstract findByEmail(email: string): Promise<User | null>;
    abstract findByCredentials(email: string, password: string): Promise<User | null>;
    abstract create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
    abstract update(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User>;
}
