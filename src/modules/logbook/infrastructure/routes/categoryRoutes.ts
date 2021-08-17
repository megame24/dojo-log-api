import express from "express";
import { endpointPermissionsMiddleware } from "../../../users/api";
import { createCategoryController } from "../../adapters/controllers";
import endpointPolicy from "./endpointPolicy.json";

const categoryRouter = express.Router();

categoryRouter.post(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  createCategoryController.execute
);

export default categoryRouter;
