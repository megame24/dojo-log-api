import RegisterUserViaEmailController from "./registerUserViaEmailController";
import { MockRegisterUserViaEmail } from "../../testUtils";
import AppError from "../../../shared/AppError";
import { mockNext, mockRes } from "../../../shared/testUtils";

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
  it("When there's an error, should call mockNext middleware function call with the error", async () => {
    mockRegisterUserViaEmail.execute.mockRejectedValueOnce(
      AppError.badRequestError()
    );

    await registerUserViaEmailController.execute(req, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(AppError.badRequestError());
  });

  it("Should call register user via email use case and return 201 when there's no error", async () => {
    // improve mock return value
    mockRegisterUserViaEmail.execute.mockResolvedValueOnce({
      authToken: "random token",
      user: {},
    });

    await registerUserViaEmailController.execute(req, mockRes, mockNext);

    expect(mockRegisterUserViaEmail.execute).toBeCalledWith(req.body);
    expect(mockRes.status).toBeCalledWith(201);
  });
});
