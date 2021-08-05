import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";

const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
if (!IS_PRODUCTION) app.use(morgan("dev"));

app.use("/", (req: Request, res: Response) => {
  return res.json("Welcome to dojolog");
});

app.listen(PORT, () => {
  console.info(`Server up and running on port ${PORT}`);
});
