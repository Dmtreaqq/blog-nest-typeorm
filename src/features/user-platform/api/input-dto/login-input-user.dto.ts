import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../common/decorators/custom-trim.decorator';

export class LoginInputUserDto {
  @IsNotEmpty()
  @Trim()
  @IsString()
  loginOrEmail: string;

  @IsNotEmpty()
  @Trim()
  @IsString()
  password: string;
}
