import { IAccountIDGenerator } from "../../interfaces/services/IAccountIdGenerator.js";
import { customAlphabet } from "nanoid";

export class NanoGiggrIdGenerator implements IAccountIDGenerator {
    private readonly alphabets;
    private readonly nanoid;

    constructor() {
        this.alphabets = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.nanoid = customAlphabet(this.alphabets, 16);
    }
    
    async generate(): Promise<string> {
        return this.nanoid();
    }
}