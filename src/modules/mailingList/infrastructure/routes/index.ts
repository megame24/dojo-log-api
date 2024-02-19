import express from "express";
import mailingListRouter from "./mailingListRoutes";

const mailingListModuleRouter = express.Router();

mailingListModuleRouter.use("/mailing-list", mailingListRouter);

export default mailingListModuleRouter;
