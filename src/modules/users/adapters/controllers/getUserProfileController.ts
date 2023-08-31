import Adapter from "../../../shared/adapters/adapter";

export default class GetUserProfileController extends Adapter {
  constructor() {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { user } = req;

    try {
      const userProfileResponseDTO = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      };
      res.status(200).json(userProfileResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
