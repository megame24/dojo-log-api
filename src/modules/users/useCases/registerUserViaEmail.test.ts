import { RegisterUserViaEmailImpl } from "./registerUserViaEmail";
import {
  MockSecurityService,
  MockUserRepo,
  MockUUIDService,
  MockEmailService,
  MockPersistentTokenRepo,
} from "../testUtils";
import User from "../entities/user";

const mockUserRepo = new MockUserRepo();

const registerUserViaEmail = new RegisterUserViaEmailImpl(
  new MockSecurityService(),
  new MockUUIDService(),
  mockUserRepo,
  new MockEmailService(),
  new MockPersistentTokenRepo()
);

const registerUserDTO = {
  username: "user1234",
  email: "email@test.com",
  password: "P@ssw0rd",
  name: "Mr. Taiemo",
};

describe("Registering a user via email", () => {
  it("Should throw a 400 error when email already exists", async () => {
    let error;
    mockUserRepo.emailExists.mockResolvedValueOnce(true);

    try {
      await registerUserViaEmail.execute(registerUserDTO);
    } catch (err) {
      error = err;
    }

    expect(error.message).toEqual("User with that email already exists");
    expect(error.statusCode).toEqual(400);
  });

  it("Should throw a 400 error when username already exists", async () => {
    let error;
    mockUserRepo.usernameExists.mockResolvedValueOnce(true);

    try {
      await registerUserViaEmail.execute(registerUserDTO);
    } catch (err) {
      error = err;
    }

    expect(error.message).toEqual("User with that username already exists");
    expect(error.statusCode).toEqual(400);
  });

  it("Should call create on userRepo when all checks pass", async () => {
    let error;
    mockUserRepo.emailExists.mockResolvedValueOnce(false);
    mockUserRepo.usernameExists.mockResolvedValueOnce(false);

    try {
      await registerUserViaEmail.execute(registerUserDTO);
    } catch (err) {
      error = err;
    }

    const user = await User.create(
      {
        id: "this_is_a_random_uuid",
        name: "Mr. Taiemo",
        email: "email@test.com",
        username: "user1234",
        password: "P@ssw0rd",
        isPasswordHashed: false,
        isPasswordRequired: true,
      },
      new MockSecurityService(),
      new MockUUIDService()
    );
    expect(mockUserRepo.create).toBeCalledWith(user);
    expect(error).toBeUndefined();
  });
});
