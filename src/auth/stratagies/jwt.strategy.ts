import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.access_token; // Extract JWT from cookies
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET', 'defaultSecret'), // Use the secret from environment variables
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // This payload will be the decrypted token payload you provided when signing the token
    console.log('Payload:', payload);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
