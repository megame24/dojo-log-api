export default abstract class Adapter {
  constructor() {
    this.execute = this.execute.bind(this);
  }

  execute(req: any, res: any, next: any) {
    console.log("Not implemented");
  }

  executeWrapper(props: any) {
    return (req: any, res: any, next: any) => {
      console.log("Not implemented");
    };
  }
}
