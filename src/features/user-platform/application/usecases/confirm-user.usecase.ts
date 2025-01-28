import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repositories/users.repository';
import { BadRequestException } from '@nestjs/common';

export class ConfirmUserCommand {
  constructor(public confirmCode: string) {}
}

@CommandHandler(ConfirmUserCommand)
export class ConfirmUserUseCase
  implements ICommandHandler<ConfirmUserCommand, void>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: ConfirmUserCommand): Promise<void> {
    const user = await this.usersRepository.findByConfirmationCode(
      command.confirmCode,
    );

    if (!user) {
      throw new BadRequestException([
        {
          message: 'Incorrect code',
          field: 'code',
        },
      ]);
    }

    if (user.userMetaInfo.isConfirmed) {
      throw new BadRequestException([
        {
          message: 'Code already used',
          field: 'code',
        },
      ]);
    }

    if (
      new Date().toISOString() >
      new Date(user.userMetaInfo.confirmationCodeExpirationDate).toISOString()
    ) {
      throw new BadRequestException([
        {
          message: 'Code expired',
          field: 'code',
        },
      ]);
    }

    if (command.confirmCode !== user.userMetaInfo.confirmationCode) {
      throw new BadRequestException([
        {
          message: 'Incorrect code',
          field: 'code',
        },
      ]);
    }

    user.markConfirmed();

    await this.usersRepository.save(user);
  }
}
