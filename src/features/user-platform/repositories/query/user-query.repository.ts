import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/user.entity';
import { Repository } from 'typeorm';
import { UserViewDto } from '../../api/view-dto/users.view-dto';
import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findUserByIdOrThrow(id: string): Promise<UserViewDto> {
    const user = await this.usersRepository.findOne({
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

  async findAllUsers(
    query: GetUsersQueryParams,
  ): Promise<BasePaginationViewDto<UserViewDto[]>> {
    const {
      searchLoginTerm,
      searchEmailTerm,
      sortDirection,
      sortBy,
      pageSize,
      pageNumber,
    } = query;

    const builder = this.usersRepository.createQueryBuilder('u');

    if (searchEmailTerm) {
      builder.orWhere(`u.email ILIKE '%${searchEmailTerm}%'`);
    }

    if (searchLoginTerm) {
      builder.orWhere(`u.login ILIKE '%${searchLoginTerm}%'`);
    }

    const usersCount = await builder.getCount();

    builder
      .orderBy(
        `u.${sortBy}`,
        `${sortDirection.toUpperCase() as 'ASC' | 'DESC'}`,
      )
      .limit(pageSize)
      .offset(query.calculateSkip());

    const users = await builder.getMany();

    return BasePaginationViewDto.mapToView({
      items: users.map(UserViewDto.mapToView),
      pageSize,
      page: pageNumber,
      totalCount: usersCount,
    });
  }
}
