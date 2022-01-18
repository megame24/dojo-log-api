import express from "express";
import categoryRouter from "./categoryRoutes";
import logbookRouter from "./logbookRoutes";

const logbookModuleRouter = express.Router();

logbookModuleRouter.use("/categories", categoryRouter);
logbookModuleRouter.use("/logbooks", logbookRouter);

export default logbookModuleRouter;
