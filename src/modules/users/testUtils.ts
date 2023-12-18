import { DateService } from "../shared/infrastructure/services/dateService";
import { EmailService } from "../shared/infrastructure/services/emailService";
import { UUIDService } from "../shared/infrastructure/services/uuidService";
import { PersistentTokenRepo } from "./infrastructure/repositories/persistentTokenRepo";
import { UserRepo } from "./infrastructure/repositories/userRepository";
import { SecurityService } from "./infrastructure/services/securityService";
import { RegisterUser } from "./useCases/registerUser";

export class MockUserRepo implements UserRepo {
  create = jest.fn();
  getUserByEmail = jest.fn();
  getUserByUsername = jest.fn();
  update = jest.fn();
  getUserById = jest.fn();
  delete = jest.fn();
}

export class MockPersistentTokenRepo implements PersistentTokenRepo {
  create = jest.fn();
  getByUserIdAndToken = jest.fn();
  deleteOne = jest.fn();
  deleteMany = jest.fn();
}

export class MockSecurityService implements SecurityService {
  hash = jest.fn().mockResolvedValue("hashed-password");
  compareHash = jest.fn();
  generateToken = jest.fn();
  verifyToken = jest.fn();
  generateRandomDigits = jest.fn();
  getExpiryDate = jest.fn();
}

export class MockUUIDService implements UUIDService {
  generate = jest.fn().mockReturnValue("this_is_a_random_uuid");
}

export class MockRegisterUser implements RegisterUser {
  execute = jest.fn();
}

export const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};

export const mockJwt = {
  sign: jest.fn(),
  verify: jest.fn(),
};

export const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

export class MockEmailService implements EmailService {
  sendVerificationCodeMail = jest.fn();
  sendVerificationTokenMail = jest.fn();
  sendPasswordResetTokenMail = jest.fn();
  sendPasswordResetCodeMail = jest.fn();
}

export class MockDateService implements DateService {
  timezone: string | undefined;
  getDayOfYear = jest.fn();
  getTimelessTimestamp = jest.fn();
  getTimelessDate = jest.fn();
  addTimeToDate = jest.fn();
  convertDateStringToDate = jest.fn();
}
