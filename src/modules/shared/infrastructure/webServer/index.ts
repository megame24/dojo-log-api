import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import appRouter from "../routes";
import AppError from "../../core/AppError";

const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
if (!IS_PRODUCTION) app.use(morgan("dev"));

app.use(appRouter);

// handle 404 endpoints
app.use((req: Request, res: Response, next: NextFunction) => {
  next(AppError.notFoundError());
});

// error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (!IS_PRODUCTION) console.log(error); // explore a better logger

  if (error instanceof AppError) {
    return res.status(error.statusCode).json(error.message);
  }

  const unhandledError = AppError.internalServerError();
  return res.status(unhandledError.statusCode).json(unhandledError.message);
});

app.listen(PORT, () => {
  console.info(`Server up and running on port ${PORT}`);
});
