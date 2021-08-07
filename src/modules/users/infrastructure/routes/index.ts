import express from "express";
import { registerUserViaEmailController } from "../../interfaceAdapters/controllers";

const userRouter = express.Router();

userRouter.post("/register", (req, res, next) =>
  registerUserViaEmailController.execute(req, res, next)
);

export { userRouter };
