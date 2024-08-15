import { LambdaFunctionsService } from "../../shared/infrastructure/services/lambdaFunctionsService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import User, { Role } from "../entities/user";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface AppleSignInVerifyDTO {
  idToken: string;
  appleUserFullName: string;
}

interface AppleSignInVerifyReturnType {
  authToken: string;
  user: User;
}

export interface AppleSignInVerify
  extends UseCase<AppleSignInVerifyDTO, Promise<AppleSignInVerifyReturnType>> {
  execute: (
    appleSignInVerifyDTO: AppleSignInVerifyDTO
  ) => Promise<AppleSignInVerifyReturnType>;
}

export class AppleSignInVerifyImpl implements AppleSignInVerify {
  constructor(
    private securityService: SecurityService,
    private uuidService: UUIDService,
    private userRepo: UserRepo,
    private lambdaFunctionsService: LambdaFunctionsService
  ) {}

  async execute(
    appleSignInVerifyDTO: AppleSignInVerifyDTO
  ): Promise<AppleSignInVerifyReturnType> {
    const { idToken, appleUserFullName } = appleSignInVerifyDTO;

    const payload = await this.lambdaFunctionsService.invokeLambda(
      <string>process.env.APPLE_SIGN_IN_SERVICE_LAMBDA_NAME,
      { idToken }
    );
    const { email } = payload.body;

    let name = appleUserFullName;
    if (!appleUserFullName) {
      name = email.split("@")[0];
    }

    let user = await this.userRepo.getUserByEmail(email);

    if (!user) {
      user = await User.create(
        {
          email,
          name,
          username: email,
          role: Role.USER,
          isPasswordHashed: false,
          isPasswordRequired: false,
          verified: true,
        },
        this.securityService,
        this.uuidService
      );
      await this.userRepo.create(user);
    }

    const authToken = this.securityService.generateToken({
      id: user.id,
      username: user.username,
      verified: user.verified,
      role: user.role,
      name: user.name,
      email: user.email,
      expoNotificationTokens: user.expoNotificationTokens,
    });
    return { authToken, user };
  }
}
