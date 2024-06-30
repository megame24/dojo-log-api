import AppError from "../AppError";
import { UUIDService } from "../infrastructure/services/uuidService";

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export default abstract class Entity {
  protected static validValidationResult: ValidationResult = {
    isValid: true,
    message: "",
  };
  protected static passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!”#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]).{8,}$/;
  protected static emailRegEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(props: any, private uuidService: UUIDService) {
    if (!props.id) {
      props.id = this.uuidService.generate();
    }
  }

  protected static validateEmail(email: string): ValidationResult {
    if (!email) {
      return { isValid: false, message: "Email is required" };
    }
    if (!Entity.emailRegEx.test(email)) {
      return { isValid: false, message: "Invalid email" };
    }
    return Entity.validValidationResult;
  }

  static formatEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  protected static validateString(prop: {
    key: string;
    value: string;
  }): ValidationResult {
    if (!prop.value)
      return { isValid: false, message: `${prop.key} is required` };
    if (prop.value.length < 2 || prop.value.length >= 255) {
      return {
        isValid: false,
        message: `${prop.key} length must be greater than 1 and less than 255`,
      };
    }
    return Entity.validValidationResult;
  }

  protected static validateEnum(prop: { key: string; value: any; Enum: any }) {
    if (!prop.Enum[prop.value]) {
      return { isValid: false, message: `Invalid ${prop.key}` };
    }
    return Entity.validValidationResult;
  }

  protected static validateNumber(prop: {
    key: string;
    value: any;
  }): ValidationResult {
    if (isNaN(prop.value))
      return { isValid: false, message: `${prop.key} is not a valid number` };
    return Entity.validValidationResult;
  }

  protected static isRequiredValidation(prop: {
    key: string;
    value: any;
  }): ValidationResult {
    if (!prop.value)
      return { isValid: false, message: `${prop.key} is required` };
    return Entity.validValidationResult;
  }

  protected static validateProp<T>(
    prop: T,
    validator: (prop: T) => ValidationResult
  ) {
    const validationResult = validator(prop);
    if (!validationResult.isValid) {
      throw AppError.badRequestError(validationResult.message);
    }
  }
}
