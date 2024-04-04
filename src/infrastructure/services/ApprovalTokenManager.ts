import jwt from 'jsonwebtoken';
import { ITokenManager } from '../../interfaces/services/ITokenManager.js';

export class JWTTokenGenerator<Payload> implements ITokenManager<Payload> {
    private readonly secret: string;

    constructor(secret: string) {
        this.secret = secret;
    }

    public generate(payload: Payload): string {
        return jwt.sign(payload as object, this.secret, { expiresIn: '16h' });
    }

    public verify(token: string): Payload {
        return jwt.verify(token, this.secret) as Payload;
    }
}
