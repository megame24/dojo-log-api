export default class AppError extends Error {
  statusCode: number;
  rawError: Error | null;

  constructor(message: string, statusCode: number, rawError: Error | null) {
    super(message);
    this.statusCode = statusCode;
    this.rawError = rawError;
  }

  static badRequestError(message = "Bad request", rawError = null): AppError {
    return new AppError(message, 400, rawError);
  }

  static unauthorizedError(
    message = "Unauthorized",
    rawError = null
  ): AppError {
    return new AppError(message, 401, rawError);
  }

  static forbiddenError(message = "Forbidden", rawError = null): AppError {
    return new AppError(message, 403, rawError);
  }

  static internalServerError(
    message = "Internal server error",
    rawError = null
  ): AppError {
    return new AppError(message, 500, rawError);
  }

  static notFoundError(message = "Not found", rawError = null): AppError {
    return new AppError(message, 404, rawError);
  }
}
