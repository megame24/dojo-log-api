import express from "express";
import categoryRouter from "./categoryRoutes";
import fileRouter from "./fileRoutes";
import logbookRouter from "./logbookRoutes";
import rewardRouter from "./rewardRoutes";

const logbookModuleRouter = express.Router();

logbookModuleRouter.use("/categories", categoryRouter);
logbookModuleRouter.use("/rewards", rewardRouter);
logbookModuleRouter.use("/logbooks", logbookRouter);
logbookModuleRouter.use("/files", fileRouter);

export default logbookModuleRouter;
