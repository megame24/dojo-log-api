import {
  DateService,
  TimeMetric,
} from "../../../shared/infrastructure/services/dateService";

export interface SecurityService {
  hash: (plaintext: string) => Promise<string>;
  compare: (plainText: string, hash: string) => Promise<boolean>;
  generateToken: (payload: any, expiresIn?: string) => string;
  generateRandomDigits: (length?: number) => string;
  verifyToken: (token: string) => any;
  getExpiryDate: (expiresIn?: string) => Date;
}

export class SecurityServiceImpl implements SecurityService {
  private saltRounds = 10;
  private tokenSecret = process.env.TOKEN_SECRET;
  private tokenExpiresIn = process.env.AUTH_TOKEN_EXPIRES_IN;

  constructor(
    private bcrypt: any,
    private jwt: any,
    private dateService: DateService
  ) {}

  hash(plaintext: string): Promise<string> {
    return this.bcrypt.hash(plaintext, this.saltRounds);
  }

  compare(plainText: string, hash: string): Promise<boolean> {
    return this.bcrypt.compare(plainText, hash);
  }

  generateToken(payload: any, expiresIn = this.tokenExpiresIn): string {
    return this.jwt.sign(payload, this.tokenSecret, { expiresIn });
  }

  generateRandomDigits(length = 6): string {
    const preNum = Math.pow(10, length - 1);
    const postNum = 9 * preNum;

    return Math.floor(preNum + Math.random() * postNum).toString();
  }

  verifyToken(token: string): any {
    try {
      return this.jwt.verify(token, this.tokenSecret);
    } catch (err) {
      return false;
    }
  }

  getExpiryDate(expiresIn?: string): Date {
    expiresIn = expiresIn || "1h";
    const now = new Date();
    const [value, metric] = expiresIn.split("");

    return this.dateService.addTimeToDate(
      now,
      Number(value),
      <TimeMetric>metric
    );
  }
}
