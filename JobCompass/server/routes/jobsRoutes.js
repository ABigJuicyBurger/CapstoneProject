import initKnex from "knex";
import configuration from "../knexfile.js";
import * as jobsController from "../controllers/jobs-controller.js";
import express from "express";

const router = express.Router();

const knex = initKnex(configuration);

router.get("/", jobsController.getJobs);

// maybe add jobs
// maybe one job

export default router;
