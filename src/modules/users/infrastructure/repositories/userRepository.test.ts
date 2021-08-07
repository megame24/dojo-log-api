import { UserRepoImpl } from "./userRepository";
import { mockUserModel } from "../../testUtils";

const userRepo = new UserRepoImpl(mockUserModel);
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
  describe("Email exists function test", () => {
    it("Should throw any error that occurs when emailExists is called", async () => {
      let emailExists, error;
      mockUserModel.findOne.mockRejectedValueOnce(new Error("A weird error"));

      try {
        emailExists = await userRepo.emailExists("test@test.com");
      } catch (err) {
        error = err;
      }

      expect(emailExists).toBeUndefined();
      expect(error.message).toEqual("Error retrieving email");
      expect(error.statusCode).toEqual(500);
    });
    it("Should return true if email exists", async () => {
      const email = "already@exists.com";
      const user = { id: 1, email };
      let emailExists, error;
      mockUserModel.findOne.mockResolvedValueOnce(user);

      try {
        emailExists = await userRepo.emailExists(email);
      } catch (err) {
        error = err;
      }

      expect(emailExists).toEqual(true);
      expect(error).toEqual(undefined);
    });
    it("Should return false if email do not exist", async () => {
      let emailExists, error;
      mockUserModel.findOne.mockResolvedValueOnce(null);

      try {
        emailExists = await userRepo.emailExists("new@email.com");
      } catch (err) {
        error = err;
      }

      expect(emailExists).toEqual(false);
      expect(error).toEqual(undefined);
    });
  });

  describe("Username exists function test", () => {
    it("Should throw any error that occurs when usernameExists is called", async () => {
      let usernameExists, error;
      mockUserModel.findOne.mockRejectedValueOnce(new Error("A weird error"));

      try {
        usernameExists = await userRepo.usernameExists("user123");
      } catch (err) {
        error = err;
      }

      expect(usernameExists).toBeUndefined();
      expect(error.message).toEqual("Error retrieving username");
      expect(error.statusCode).toEqual(500);
    });
    it("Should return true if username exists", async () => {
      const username = "already_existing_username";
      const user = { id: 1, username };
      let usernameExists, error;
      mockUserModel.findOne.mockResolvedValueOnce(user);

      try {
        usernameExists = await userRepo.usernameExists(username);
      } catch (err) {
        error = err;
      }

      expect(usernameExists).toEqual(true);
      expect(error).toBeUndefined();
    });
    it("Should return false if username do not exist", async () => {
      let usernameExists, error;
      mockUserModel.findOne.mockResolvedValueOnce(null);

      try {
        usernameExists = await userRepo.usernameExists("new_username");
      } catch (err) {
        error = err;
      }

      expect(usernameExists).toEqual(false);
      expect(error).toBeUndefined();
    });
  });

  describe("Create function test", () => {
    it("Should throw any error that occurs when create is called", async () => {
      let error;
      mockUserModel.create.mockRejectedValueOnce(new Error("A weird error"));

      try {
        await userRepo.create(user);
      } catch (err) {
        error = err;
      }

      expect(error.message).toEqual("Error creating user");
      expect(error.statusCode).toEqual(500);
    });
    it("Should call create on UserModel with the right props", async () => {
      let error;

      try {
        await userRepo.create(user);
      } catch (err) {
        error = err;
      }

      expect(mockUserModel.create).toBeCalledWith(user);
      expect(error).toBeUndefined();
    });
  });
});
