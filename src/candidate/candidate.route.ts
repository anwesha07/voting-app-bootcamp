import express from "express";
import { authenticateUser } from "../middleware";
import {
  createCandidateController,
  fetchCandidateController,
} from "./candidate.controller";
import { validateCreateCandidateDataBody } from "./candidate.middleware";

const candidateRouter = express.Router();

candidateRouter.get("/", (_req, res) => {
  res.json({ candidateRoute: "ok" });
});

candidateRouter.post(
  "/",
  authenticateUser,
  validateCreateCandidateDataBody,
  createCandidateController
);

candidateRouter.get("/:id", authenticateUser, fetchCandidateController);

export default candidateRouter;
