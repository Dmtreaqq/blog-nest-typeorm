import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UserContext } from '../dto/user-context.dto';
import { CommonConfig } from '../common.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(commonConfig: CommonConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: commonConfig.accessTokenSecret,
    });
  }

  async validate(payload: UserContext) {
    return payload;
  }
}
