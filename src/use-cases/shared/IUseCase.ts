import StatusCode from "./StatusCodes.js";

export interface IUseCase<Input, Output> {
  // endStatus: StatusCode;
  execute(input: Input): Promise<Output>;
}
