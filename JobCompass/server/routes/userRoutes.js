import initKnex from "knex";
import configuration from "../knexfile.js";
import express from "express";

import * as usersController from "../controllers/users-controller.js";

const router = express.Router();

const knex = initKnex(configuration);

/* login route */
router.post("/login", usersController.login);

/* Get meta info of user (Protected) */
router.get;

/* Protected endpoint to get user details */
router.get();

export default router;
