import Adapter from "../../../shared/adapters/adapter";
import ExpoNotificationToken from "../../entities/expoNotificationToken";
import { GetExpoNotificationTokens } from "../../useCases/getExpoNotificationTokens";

export default class GetExpoNotificationTokensController extends Adapter {
  constructor(private getExpoNotificationTokens: GetExpoNotificationTokens) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const expoNotificationTokens =
        await this.getExpoNotificationTokens.execute();

      const getExpoNotificationTokensResponseDTO = expoNotificationTokens.map(
        (expoNotificationToken: ExpoNotificationToken) => ({
          id: expoNotificationToken.id,
          userId: expoNotificationToken.userId,
          token: expoNotificationToken.token,
        })
      );

      res.status(200).json(getExpoNotificationTokensResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
