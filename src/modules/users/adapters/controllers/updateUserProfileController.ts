import Adapter from "../../../shared/adapters/adapter";
import { UpdateUser } from "../../useCases/updateUser";

export default class UpdateUserProfileController extends Adapter {
  constructor(private updateUser: UpdateUser) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const {
      user,
      body: { name, username, email },
    } = req;
    const updateUserDTO = { user, name, username, email };

    try {
      const authToken = await this.updateUser.execute(updateUserDTO);

      res.status(200).json({ authToken });
    } catch (error) {
      next(error);
    }
  }
}
