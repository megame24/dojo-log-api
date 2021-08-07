import express from "express";
import {
  registerUserViaEmailController,
  loginUserViaEmailController,
} from "../../interfaceAdapters/controllers";

const userRouter = express.Router();

userRouter.post("/register", (req, res, next) =>
  registerUserViaEmailController.execute(req, res, next)
);

userRouter.post("/login", (req, res, next) =>
  loginUserViaEmailController.execute(req, res, next)
);

export { userRouter };
