import AppError from "../AppError";

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export default abstract class Entity {
  protected static validValidationResult: ValidationResult = {
    isValid: true,
    message: "",
  };

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
