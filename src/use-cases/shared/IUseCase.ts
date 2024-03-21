export interface IUseCase<Input, Output> {
    execute(input: Input): Promise<Output | Error>;
}