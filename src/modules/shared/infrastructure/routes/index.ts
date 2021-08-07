import express from "express";
import { userRouter } from "../../../users/infrastructure/routes";

const appRouter = express.Router();

appRouter.use("/users", userRouter);

export default appRouter;
