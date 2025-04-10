import initKnex from "knex";
import configuration from "../knexfile.js";
import express from "express";

import * as jobsController from "../controllers/jobs-controller.js";

const router = express.Router();

const knex = initKnex(configuration);

// routing from /jobs

router.get("/", jobsController.getJobs);
router.get("/:id", jobsController.singleJob);
router.get("/api-jobs", jobsController.getJobsfromAPI);

export default router;
