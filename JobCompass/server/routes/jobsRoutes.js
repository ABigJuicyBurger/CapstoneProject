import express from "express";
import * as jobsController from "../controllers/jobs-controller.js";

const router = express.Router();

// routing from /jobs

router.get("/", jobsController.getJobs);
router.get("/api-jobs", jobsController.getJobsfromAPI);
router.get("/location/:location", jobsController.getJobsfromAPI);
router.get("/api-jobs/:id", jobsController.getSingleApiJob);
router.get("/:id", jobsController.singleJob);

export default router;
