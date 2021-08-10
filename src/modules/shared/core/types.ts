export interface UseCase<T, K> {
  execute: (props: T) => K;
}
export abstract class BaseAdapter {
  constructor() {
    this.execute = this.execute.bind(this);
  }

  execute(req: any, res: any, next: any) {
    // implement me
  }
}
