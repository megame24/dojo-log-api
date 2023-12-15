import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import User, { Role } from "../entities/user";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface GoogleSignInVerifyDTO {
  idToken: string;
}

export interface GoogleSignInVerify
  extends UseCase<GoogleSignInVerifyDTO, Promise<string>> {
  execute: (googleSignInVerifyDTO: GoogleSignInVerifyDTO) => Promise<string>;
}

export class GoogleSignInVerifyImpl implements GoogleSignInVerify {
  constructor(
    private securityService: SecurityService,
    private uuidService: UUIDService,
    private userRepo: UserRepo,
    private verifyClient: any
  ) {}

  async execute(googleSignInVerifyDTO: GoogleSignInVerifyDTO): Promise<string> {
    const { idToken } = googleSignInVerifyDTO;
    const ticket = await this.verifyClient.verifyIdToken({
      idToken,
      audience: [
        process.env.IOS_CLIENT_ID,
        process.env.ANDROID_CLIENT_ID,
        process.env.WEB_CLIENT_ID,
      ],
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

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
    });
    return authToken;
  }
}
