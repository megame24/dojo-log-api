import express from "express";

const logbookRouter = express.Router();

logbookRouter.post("/");
// protectedRoute(logbookRouter.post, "/needs-auth", controller, tailMiddleware);
