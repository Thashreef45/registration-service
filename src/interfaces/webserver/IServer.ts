export interface Server<T> {

    run(callback: () => void): Promise<void>;
  }