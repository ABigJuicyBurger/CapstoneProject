import initKnex from "knex";
import configuration from "../knexfile.js";
import express from "express";

import * as usersController from "../controllers/users-controller.js";
import authenticateToken from "../middleware/AuthToken.js";

const router = express.Router();

const knex = initKnex(configuration);

/* login route */
router.post("/login", usersController.login);

/* register route */
router.post("/register", usersController.register);

/* Get meta info of user (Protected) */
router.get("/meta", authenticateToken, usersController.getMetaInfo);

/* Protected endpoint to get user details */
router.get("/userProfile", authenticateToken, usersController.getUser);

export default router;
