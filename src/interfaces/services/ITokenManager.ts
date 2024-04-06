export interface ITokenManager<Payload> {
    generate(payload: Payload): string;
    verify(token: string): Payload;
}