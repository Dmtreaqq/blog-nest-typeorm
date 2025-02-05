/* eslint-disable */
import { UserViewDto } from '../../src/features/user-platform/api/view-dto/users.view-dto';
import { GetUsersQueryParams } from '../../src/features/user-platform/api/input-dto/get-users-query-params.input-dto';
import { BasePaginationViewDto } from '../../src/common/dto/base-pagination.view-dto';

export class UsersQueryMock {
  async findUserByIdOrThrow(id: string): Promise<UserViewDto> {
    console.log(this.findUserByIdOrThrow.name);
    return {} as any;
  }

  async findAllUsers(
    query: GetUsersQueryParams,
  ): Promise<BasePaginationViewDto<UserViewDto[]>> {
    console.log(this.findAllUsers.name);
    return {} as any;
  }
}
