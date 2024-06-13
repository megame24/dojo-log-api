import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import appRouter from "../routes";
import AppError from "../../AppError";

const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors()); // make this more restrictive!!!!!

app.use(
  morgan("dev", {
    skip: function (req, res) {
      // This condition checks if the request is a GET request to the /health path
      return req.path === "/health" && req.method === "GET";
    },
  })
);

app.use(appRouter);

app.get("/health", (req, res) => {
  res.status(200);
  res.send("healthy");
});

// handle 404 endpoints
app.use((req: Request, res: Response, next: NextFunction) => {
  next(AppError.notFoundError());
});

// error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error); // explore a better logger

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  const unhandledError = AppError.internalServerError();
  return res
    .status(unhandledError.statusCode)
    .json({ message: unhandledError.message });
});

app.listen(PORT, () => {
  console.info(`Server up and running on port ${PORT}`);
});
