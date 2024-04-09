import { UserRepoImpl } from "./userRepository";
import {
  mockExpoNotificationTokenModel,
  MockSecurityService,
  mockUserModel,
  MockUUIDService,
} from "../../testUtils";

const userRepo = new UserRepoImpl(
  mockUserModel,
  mockExpoNotificationTokenModel,
  new MockSecurityService(),
  new MockUUIDService()
);
const user: any = {
  id: "random_uuid",
  name: "Mr. Krabs",
  username: "secret_formula",
  password: "hashed_password",
  email: "krabs@patty.com",
  verified: false,
  role: "USER",
};

describe("User repository test", () => {
  describe("Create function test", () => {
    it("Should throw any error that occurs when create is called", async () => {
      let error;
      mockUserModel.create.mockRejectedValueOnce(new Error("A weird error"));

      try {
        await userRepo.create(user);
      } catch (err: any) {
        error = err;
      }

      expect(error.message).toEqual("Error creating user");
      expect(error.statusCode).toEqual(500);
    });
    it("Should call create on UserModel with the right props", async () => {
      let error;

      try {
        await userRepo.create(user);
      } catch (err: any) {
        error = err;
      }

      expect(mockUserModel.create).toBeCalledWith(user);
      expect(error).toBeUndefined();
    });
  });
});
