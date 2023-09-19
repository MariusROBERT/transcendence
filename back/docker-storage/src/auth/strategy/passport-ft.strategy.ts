import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-42';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.FT_OAUTH_UID,
      clientSecret: process.env.FT_OAUTH_SECRET,
      callbackURL: '/api/auth/callback/42',
      passReqToCallback: true,
    });
  }

  async validate(
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    request.session.accessToken = accessToken;
    // console.log('accessToken: ', accessToken);
    // console.log('refreshToken: ', refreshToken);
    // console.log('profile: ', profile);
    // console.log('login: ', profile.username);
    return profile;
    // return profile?.provider === '42';
  }
}
