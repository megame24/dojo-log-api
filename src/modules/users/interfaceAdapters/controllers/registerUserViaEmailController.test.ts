import RegisterUserViaEmailController from "./registerUserViaEmailController";
import { MockRegisterUserViaEmail } from "../../testUtils";
import AppError from "../../../shared/core/AppError";
import { next, res } from "../../../shared/core/testUtils";

const mockRegisterUserViaEmail = new MockRegisterUserViaEmail();
const registerUserViaEmailController = new RegisterUserViaEmailController(
  mockRegisterUserViaEmail
);

const req = {
  body: {
    username: "user1234",
    email: "email@test.com",
    password: "P@ssw0rd",
    name: "Mr. Taiemo",
  },
};

describe("Register user via email controller test", () => {
  it("When there's an error, should call next middleware function call with the error", async () => {
    mockRegisterUserViaEmail.execute.mockRejectedValueOnce(
      AppError.badRequestError()
    );

    await registerUserViaEmailController.execute(req, res, next);

    expect(next).toBeCalledWith(AppError.badRequestError());
  });

  it("Should call register user via email use case and return 201 when there's no error", async () => {
    mockRegisterUserViaEmail.execute.mockResolvedValueOnce(undefined);

    await registerUserViaEmailController.execute(req, res, next);

    expect(mockRegisterUserViaEmail.execute).toBeCalledWith(req.body);
    expect(res.status).toBeCalledWith(201);
  });
});
