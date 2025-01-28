import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configUtilityHelper } from '../../../common/utils/configUtilityHelper';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Injectable()
export class UserPlatformConfig {
  constructor(private configService: ConfigService) {
    configUtilityHelper.validateConfig(this);
  }

  @IsNumber({}, { message: 'ACCESS_TOKEN_EXPIRATION should be a number' })
  @IsNotEmpty({ message: 'ACCESS_TOKEN_EXPIRATION should not be empty' })
  accessTokenExpiration: number = Number(
    this.configService.get('ACCESS_TOKEN_EXPIRATION'),
  );

  @IsNumber({}, { message: 'REFRESH_TOKEN_EXPIRATION should be a number' })
  @IsNotEmpty({ message: 'REFRESH_TOKEN_EXPIRATION should not be empty' })
  refreshTokenExpiration: number = Number(
    this.configService.get('REFRESH_TOKEN_EXPIRATION'),
  );

  @IsNumber({}, { message: 'THROTTLE_TTL should be a number' })
  @IsNotEmpty({ message: 'THROTTLE_TTL should not be empty' })
  throttleTtl: number = Number(this.configService.get('THROTTLE_TTL'));

  @IsNumber({}, { message: 'THROTTLE_LIMIT should be a number' })
  @IsNotEmpty({ message: 'THROTTLE_LIMIT should not be empty' })
  throttleLimit: number = Number(this.configService.get('THROTTLE_LIMIT'));
}
