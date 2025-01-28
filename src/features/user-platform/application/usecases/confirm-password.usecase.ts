import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repositories/users.repository';
import { BadRequestException } from '@nestjs/common';
import { ConfirmNewPasswordDto } from '../../api/input-dto/confirm-new-password.dto';
import { CryptoService } from '../crypto.service';

export class ConfirmPasswordCommand {
  constructor(public dto: ConfirmNewPasswordDto) {}
}

@CommandHandler(ConfirmPasswordCommand)
export class ConfirmPasswordUseCase
  implements ICommandHandler<ConfirmPasswordCommand, void>
{
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute(command: ConfirmPasswordCommand): Promise<void> {
    const { newPassword, recoveryCode } = command.dto;

    const user = await this.usersRepository.findByRecoveryCode(recoveryCode);

    if (!user || user.userMetaInfo.recoveryCode !== recoveryCode) {
      throw new BadRequestException([
        {
          message: 'Incorrect code',
          field: 'recoveryCode',
        },
      ]);
    }

    if (
      new Date().toISOString() >
      new Date(user.userMetaInfo.recoveryCodeExpirationDate).toISOString()
    ) {
      throw new BadRequestException([
        {
          message: 'Expired code',
          field: 'recoveryCode',
        },
      ]);
    }

    const newPassHash =
      await this.cryptoService.createPasswordHash(newPassword);

    user.updatePassword(newPassHash);

    await this.usersRepository.save(user);
  }
}
