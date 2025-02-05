import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../domain/user.entity';
import { CreateUserInputDto } from '../../api/input-dto/create-user.input-dto';
import { CryptoService } from '../crypto.service';
import { BadRequestException } from '@nestjs/common';

export class CreateUserCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, string>
{
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const isUserWithSameLoginOrEmailExist =
      await this.usersRepository.findByLoginOrEmail(
        command.dto.login,
        command.dto.email,
      );

    if (isUserWithSameLoginOrEmailExist) {
      throw new BadRequestException([
        {
          message: 'User already exists',
          field: 'email',
        },
      ]);
    }

    const dto = command.dto;

    const hashedPassword = await this.cryptoService.createPasswordHash(
      dto.password,
    );

    const user = User.create({
      login: dto.login,
      email: dto.email,
      hashedPassword: hashedPassword,
      isConfirmed: true,
    });

    const createdUser = await this.usersRepository.save(user);
    return createdUser.id;
  }
}
