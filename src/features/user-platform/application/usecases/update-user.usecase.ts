import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repositories/users.repository';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserInputDto } from '../../api/input-dto/update-user.input-dto';

export class UpdateUserCommand {
  constructor(public dto: UpdateUserInputDto) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserUseCase
  implements ICommandHandler<UpdateUserCommand, string>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: UpdateUserCommand): Promise<string> {
    const { id, login } = command.dto;

    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException();
    }

    user.login = login;

    const result = await this.usersRepository.save(user);

    return result.id;
  }
}
