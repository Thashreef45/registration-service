export interface ITokenGenerator {
    generate(payload: object): string;
    verify(token: string): object | null;
    decode(token: string): object | null;
}