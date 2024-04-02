import { randomUUID } from "crypto"
import { IUUIDGenerator } from "../../interfaces/services/IUUIDGenerator.js";

export class CryptoUUIDGenerator implements IUUIDGenerator {
    generate(): string {
        return randomUUID();
    }
}