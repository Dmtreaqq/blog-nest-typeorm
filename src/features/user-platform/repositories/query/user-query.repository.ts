import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/user.entity';
import { Repository } from 'typeorm';
import { UserViewDto } from '../../api/view-dto/users.view-dto';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUserById(id: string): Promise<UserViewDto> {
    const user = await this.userRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return UserViewDto.mapToView(user);
  }
}
