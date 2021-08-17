import express from "express";
import categoryRouter from "./categoryRoutes";

const logbookModuleRouter = express.Router();

logbookModuleRouter.use("/categories", categoryRouter);

export default logbookModuleRouter;
