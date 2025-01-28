import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<{ id: string }> {
    const user = await this.usersRepository.findByLoginOrEmail(
      loginOrEmail,
      loginOrEmail,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    const compareResult = await this.cryptoService.comparePasswords({
      password,
      hash: user.password,
    });

    if (compareResult) {
      return { id: user.id };
    }

    throw new UnauthorizedException();
  }
}
