import { IAccountIDGenerator } from "../../interfaces/services/IAccountIdGenerator.js";
import crypto from 'crypto';

export class GiggrSnowflake implements IAccountIDGenerator {
    async generate(): Promise<string> {
        const random = parseInt(crypto.randomBytes(7).toString("hex").toUpperCase(), 16) % 1000000000000000;
        return random.toString();
    }
}