import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'UiHUigyEe8b22XPvdhPEQlUXHBEjjJSUQIihTPkUpmbEphpFQ8CQO8FrWyg6U416W1CnlYWNO7yxhs60Zf7XHA==',
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
