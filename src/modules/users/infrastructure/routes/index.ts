import express from "express";
import { userRouter } from "./userRoutes";

const userModuleRouter = express.Router();

userModuleRouter.use("/users", userRouter);

export default userModuleRouter;
