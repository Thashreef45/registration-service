import jwt from 'jsonwebtoken';
import { ITokenGenerator } from '../../interfaces/services/ITokenGenerator.js';

export class TokenGenerator implements ITokenGenerator {
    private readonly secret: string;

    constructor(secret: string) {
        this.secret = "shushh";
    }

    public generate(payload: object): string {
        return jwt.sign(payload as object, this.secret, { expiresIn: '16h' });
    }

    public verify(token: string): object | null {
        try {
            const decoded = jwt.verify(token, this.secret) as object;
            return decoded;
        } catch (err) {
            return null;
        }
    }
    
    public decode(token: string): object | null {
        try {
            const decoded = jwt.decode(token) as object;
            return decoded;
        } catch (err) {
            return null;
        }
    }
}
