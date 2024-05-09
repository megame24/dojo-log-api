import { TextDecoder, TextEncoder } from "util";

export interface LambdaFunctionsService {
  invokeLambda: (functionName: string, payload: any) => Promise<any>;
}

export class LambdaFunctionsServiceImpl implements LambdaFunctionsService {
  lambdaClient: any;

  constructor(private LambdaClient: any, private InvokeCommand: any) {
    this.lambdaClient = new this.LambdaClient({
      region: process.env.AWS_REGION,
    });
  }

  async invokeLambda(functionName: string, payload: any): Promise<any> {
    const params = {
      FunctionName: functionName,
      InvocationType: "RequestResponse",
      Payload: new TextEncoder().encode(JSON.stringify(payload)),
    };

    const invokeCommand = new this.InvokeCommand(params);

    try {
      const data = await this.lambdaClient.send(invokeCommand);
      const decodedPayload = JSON.parse(
        new TextDecoder("utf-8").decode(data.Payload)
      );
      console.log("Lambda invoke successful");
      return decodedPayload;
    } catch (err) {
      console.error("Error invoking Lambda function:", err);
      throw err;
    }
  }
}
