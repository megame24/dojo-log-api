import express from "express";
import { Operation } from "../../../shared/accessControl";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import { logbookAccessControl } from "../../accessControl";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
} from "../../adapters/controllers";
import GetCategoriesController from "../../adapters/controllers/getCategoriesController";
import { getCategoryImpl } from "../../useCases";
import endpointPolicy from "./endpointPolicy.json";

const categoryRouter = express.Router();

categoryRouter.post(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "categories",
    resourcesForAccessCheck: [],
  }),
  createCategoryController.execute
);

categoryRouter.delete(
  "/:categoryId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.DELETE,
    resourceType: "categories",
    resourcesForAccessCheck: [
      { name: "category", getResource: getCategoryImpl },
    ],
  }),
  deleteCategoryController.execute
);

categoryRouter.get(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET_MANY,
    resourceType: "categories",
    resourcesForAccessCheck: [],
  }),
  getCategoriesController.execute
);

export default categoryRouter;
