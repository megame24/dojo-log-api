import {
  createCategoryImpl,
  createGoalImpl,
  createLogbookImpl,
  createLogImpl,
  deleteCategoryImpl,
  deleteLogbookImpl,
  deleteLogImpl,
  deleteRewardImpl,
  getCategoriesImpl,
  getLogbookImpl,
  getLogbooksImpl,
  getLogsImpl,
  getRewardsImpl,
  updateGoalImpl,
  updateLogbookImpl,
  updateLogImpl,
  updateCategoryImpl,
  getEarliestLogbookYearImpl,
  createRewardImpl,
  updateRewardImpl,
  deleteFileImpl,
  downloadFileImpl,
  getLiteLogbookImpl,
  batchDeleteGoalNotificationsImpl,
  batchUpdateGoalNotificationsImpl,
  saveLogbookNotificationsImpl,
  getLogbookNotificationImpl,
  deleteLogbookNotificationsImpl,
} from "../../useCases";
import BatchDeleteGoalNotificationsController from "./batchDeleteGoalNotificationsController";
import BatchUpdateGoalNotificationsController from "./batchUpdateGoalNotificationsController";
import CreateCategoryController from "./createCategoryController";
import CreateGoalController from "./createGoalController";
import CreateLogbookController from "./createLogbookController";
import CreateLogController from "./createLogController";
import CreateRewardController from "./createRewardController";
import DeleteCategoryController from "./deleteCategoryController";
import DeleteFileController from "./deleteFileController";
import DeleteLogbookController from "./deleteLogbookController";
import DeleteLogbookNotificationsController from "./deleteLogbookNotificationsController";
import DeleteLogController from "./deleteLogController";
import DeleteRewardController from "./deleteRewardController";
import DownloadFileController from "./downloadFileController";
import GetCategoriesController from "./getCategoriesController";
import GetEarliestLogbookYearController from "./getEarliestLogbookYearController";
import GetGoalController from "./getGoalController";
import GetLogbookController from "./getLogbookController";
import GetLogbookNotificationController from "./getLogbookNotificationController";
import GetLogbooksController from "./getLogbooksController";
import GetLogsController from "./getLogsController";
import GetRewardsController from "./getRewardsController";
import SaveLogbookNotificationsController from "./saveLogbookNotificationsController";
import UpdateCategoryController from "./updateCategoryController";
import UpdateGoalController from "./updateGoalController";
import UpdateLogbookController from "./updateLogbookController";
import UpdateLogController from "./updateLogController";
import UpdateRewardController from "./updateRewardController";

export const createCategoryController = new CreateCategoryController(
  createCategoryImpl
);

export const createLogbookController = new CreateLogbookController(
  createLogbookImpl
);

export const createLogController = new CreateLogController(createLogImpl);

export const createGoalController = new CreateGoalController(createGoalImpl);

export const getLogbookController = new GetLogbookController(getLogbookImpl);

export const updateGoalController = new UpdateGoalController(
  updateGoalImpl,
  getLiteLogbookImpl
);

export const updateLogController = new UpdateLogController(
  updateLogImpl,
  getLiteLogbookImpl
);

export const deleteLogController = new DeleteLogController(
  deleteLogImpl,
  getLiteLogbookImpl
);

export const getLogsController = new GetLogsController(getLogsImpl);

export const updateLogbookController = new UpdateLogbookController(
  updateLogbookImpl
);

export const getRewardsController = new GetRewardsController(getRewardsImpl);

export const getLogbooksController = new GetLogbooksController(getLogbooksImpl);

export const deleteCategoryController = new DeleteCategoryController(
  deleteCategoryImpl
);

export const deleteLogbookController = new DeleteLogbookController(
  deleteLogbookImpl
);

export const deleteRewardController = new DeleteRewardController(
  deleteRewardImpl
);

export const getCategoriesController = new GetCategoriesController(
  getCategoriesImpl
);

export const updateCategoryController = new UpdateCategoryController(
  updateCategoryImpl
);

export const getEarliestLogbookYearController =
  new GetEarliestLogbookYearController(getEarliestLogbookYearImpl);

export const createRewardController = new CreateRewardController(
  createRewardImpl
);

export const updateRewardController = new UpdateRewardController(
  updateRewardImpl
);

export const deleteFileController = new DeleteFileController(deleteFileImpl);

export const getGoalController = new GetGoalController();

export const downloadFileController = new DownloadFileController(
  downloadFileImpl
);

export const batchDeleteGoalNotificationsController =
  new BatchDeleteGoalNotificationsController(batchDeleteGoalNotificationsImpl);

export const batchUpdateGoalNotificationsController =
  new BatchUpdateGoalNotificationsController(batchUpdateGoalNotificationsImpl);

export const saveLogbookNotificationsController =
  new SaveLogbookNotificationsController(saveLogbookNotificationsImpl);

export const getLogbookNotificationController =
  new GetLogbookNotificationController(getLogbookNotificationImpl);

export const deleteLogbookNotificationsController =
  new DeleteLogbookNotificationsController(deleteLogbookNotificationsImpl);
