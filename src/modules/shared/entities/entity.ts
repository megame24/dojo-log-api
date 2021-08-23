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

  constructor(props: any, private uuidService: UUIDService) {
    if (!props.id) {
      props.id = this.uuidService.generate();
    }
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
