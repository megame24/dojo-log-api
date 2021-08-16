export interface SecurityService {
  hash: (plaintext: string) => Promise<string>;
  compare: (plainText: string, hash: string) => Promise<boolean>;
  generateToken: (payload: any, expiresIn?: string) => string;
  verifyToken: (token: string) => any;
}

export class SecurityServiceImpl implements SecurityService {
  private saltRounds = 10;
  private tokenSecret = process.env.TOKEN_SECRET;
  private tokenExpiresIn = process.env.AUTH_TOKEN_EXPIRES_IN;

  constructor(private bcrypt: any, private jwt: any) {}

  hash(plaintext: string): Promise<string> {
    return this.bcrypt.hash(plaintext, this.saltRounds);
  }

  compare(plainText: string, hash: string): Promise<boolean> {
    return this.bcrypt.compare(plainText, hash);
  }

  generateToken(payload: any, expiresIn = this.tokenExpiresIn): string {
    return this.jwt.sign(payload, this.tokenSecret, { expiresIn });
  }

  verifyToken(token: string): any {
    try {
      return this.jwt.verify(token, this.tokenSecret);
    } catch (err) {
      return false;
    }
  }
}
