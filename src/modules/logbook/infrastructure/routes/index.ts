import express from "express";
import categoryRouter from "./categoryRoutes";
import logbookRouter from "./logbookRoutes";
import rewardRouter from "./rewardRoutes";

const logbookModuleRouter = express.Router();

logbookModuleRouter.use("/categories", categoryRouter);
logbookModuleRouter.use("/rewards", rewardRouter);
logbookModuleRouter.use("/logbooks", logbookRouter);

export default logbookModuleRouter;
