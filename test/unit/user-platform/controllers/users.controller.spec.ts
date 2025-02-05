import { UsersController } from '../../../../src/features/user-platform/api/users.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersQueryRepository } from '../../../../src/features/user-platform/repositories/query/user-query.repository';
import { BasicAuthGuard } from '../../../../src/common/guards/basic-auth.guard';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { UsersQueryMock } from '../../../mock/users-query-mock';
import { SortDirection } from '../../../../src/common/dto/base-query-params.input';
import {
  GetUsersQueryParams,
  UsersSortBy,
} from '../../../../src/features/user-platform/api/input-dto/get-users-query-params.input-dto';
import { CreateUserInputDto } from '../../../../src/features/user-platform/api/input-dto/create-user.input-dto';
import { CommandBusMock } from '../../../mock/command-bus-mock';
import { CreateUserCommand } from '../../../../src/features/user-platform/application/usecases/create-user.usecase';
import { DeleteUserCommand } from '../../../../src/features/user-platform/application/usecases/delete-user.usecase';

describe('UsersController', () => {
  let controller: UsersController;
  let queryRepoMock: UsersQueryRepository;
  let commandBusMock: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [UsersController],
      providers: [UsersQueryRepository],
    })
      .overrideProvider(UsersQueryRepository)
      .useClass(UsersQueryMock)
      .overrideProvider(CommandBus)
      .useClass(CommandBusMock)
      .overrideGuard(BasicAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<UsersController>(UsersController);
    queryRepoMock = module.get<UsersQueryRepository>(UsersQueryRepository);
    commandBusMock = module.get<CommandBus>(CommandBus);
  });

  // it('Should be defined', () => {
  //   expect(controller).toBeDefined();
  // });

  it('Should findUser from QueryRepo', async () => {
    jest.spyOn(queryRepoMock, 'findUserByIdOrThrow');

    await controller.getById({ id: '123' });

    expect(queryRepoMock.findUserByIdOrThrow).toHaveBeenCalledTimes(1);
    expect(queryRepoMock.findUserByIdOrThrow).toHaveBeenCalledWith('123');
  });

  it('Should findAllUsers from QueryRepo', async () => {
    jest.spyOn(queryRepoMock, 'findAllUsers');
    const query = {
      searchLoginTerm: '',
      searchEmailTerm: '',
      pageNumber: 1,
      pageSize: 10,
      sortBy: UsersSortBy.CreatedAt,
      sortDirection: SortDirection.DESC,
    };

    await controller.getAll(query as GetUsersQueryParams);

    expect(queryRepoMock.findAllUsers).toHaveBeenCalledTimes(1);
    expect(queryRepoMock.findAllUsers).toHaveBeenCalledWith(query);
  });

  it('Should createUser via CommandBus and get from QueryRepo', async () => {
    jest.spyOn(queryRepoMock, 'findUserByIdOrThrow');
    jest.spyOn(commandBusMock, 'execute');

    const dto: CreateUserInputDto = {
      login: 'login',
      email: 'email',
      password: 'password',
    };

    await controller.createUser(dto);

    expect(commandBusMock.execute).toHaveBeenCalledTimes(1);
    expect(commandBusMock.execute).toHaveBeenCalledWith(
      new CreateUserCommand(dto),
    );
    expect(queryRepoMock.findUserByIdOrThrow).toHaveBeenCalledTimes(1);
  });

  it('Should delete user via CommandBus', async () => {
    jest.spyOn(commandBusMock, 'execute');

    await controller.deleteUser({ id: '1' });

    expect(commandBusMock.execute).toHaveBeenCalledTimes(1);
    expect(commandBusMock.execute).toHaveBeenCalledWith(
      new DeleteUserCommand('1'),
    );
  });
});
