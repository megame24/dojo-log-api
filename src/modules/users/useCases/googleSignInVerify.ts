import { LambdaFunctionsService } from "../../shared/infrastructure/services/lambdaFunctionsService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import User, { Role } from "../entities/user";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface GoogleSignInVerifyDTO {
  idToken: string;
}

interface GoogleSignInVerifyReturnType {
  authToken: string;
  user: User;
}

export interface GoogleSignInVerify
  extends UseCase<
    GoogleSignInVerifyDTO,
    Promise<GoogleSignInVerifyReturnType>
  > {
  execute: (
    googleSignInVerifyDTO: GoogleSignInVerifyDTO
  ) => Promise<GoogleSignInVerifyReturnType>;
}

export class GoogleSignInVerifyImpl implements GoogleSignInVerify {
  constructor(
    private securityService: SecurityService,
    private uuidService: UUIDService,
    private userRepo: UserRepo,
    private lambdaFunctionsService: LambdaFunctionsService
  ) {}

  async execute(
    googleSignInVerifyDTO: GoogleSignInVerifyDTO
  ): Promise<GoogleSignInVerifyReturnType> {
    const { idToken } = googleSignInVerifyDTO;

    const payload = await this.lambdaFunctionsService.invokeLambda(
      <string>process.env.GOOGLE_SIGN_IN_SERVICE_LAMBDA_NAME,
      { idToken }
    );
    const { email, name } = payload.body;

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
