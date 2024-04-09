import Adapter from "../../../shared/adapters/adapter";
import { CreateExpoNotificationToken } from "../../useCases/createExpoNotificationToken";

export default class CreateExpoNotificationTokenController extends Adapter {
  constructor(private crateExpoNotificationToken: CreateExpoNotificationToken) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { user, body } = req;
    const createExpoNotificationTokenDTO = {
      userId: user.id,
      token: body.token,
    };

    try {
      await this.crateExpoNotificationToken.execute(
        createExpoNotificationTokenDTO
      );
      res
        .status(201)
        .json({ message: "expoNotificationToken created successfully" });
    } catch (error) {
      next(error);
    }
  }
}
