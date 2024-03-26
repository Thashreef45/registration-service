export interface IAccountIDGenerator {
    generate(): Promise<string>;
}