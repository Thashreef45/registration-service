export interface Server<T> {
    app: T;
    port: number;
    run(callback: () => void): Promise<void>;
  }