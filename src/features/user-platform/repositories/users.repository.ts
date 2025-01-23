import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async save(user: User) {
    await this.usersRepository.save(user);
  }

  async createUser(user: User) {
    const createdUser = await this.usersRepository.save(user);

    return createdUser.id;
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }

    user.markDeleted();

    await this.usersRepository.save(user);
  }
}
