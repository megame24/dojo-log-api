import { VerifyUser, VerifyUserDTO } from "../../useCases/verifyUser";

export default class VerifyUserController {
  constructor(private verifyUser: VerifyUser) {}

  async execute(req: any, res: any, next: any) {
    const { id, token } = req.params;
    const verifyUserDTO: VerifyUserDTO = { userId: id, token };

    try {
      await this.verifyUser.execute(verifyUserDTO);
      return res.status(200).json({ message: "Verification successful" });
    } catch (error) {
      next(error);
    }
  }
}
