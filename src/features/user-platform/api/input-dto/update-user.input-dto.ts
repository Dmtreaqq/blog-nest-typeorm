import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../../common/decorators/custom-trim.decorator';

export class UpdateUserInputDto {
  id: string;

  @MinLength(3)
  @MaxLength(10)
  @IsNotEmpty()
  @Trim()
  @IsString()
  login: string;
}
