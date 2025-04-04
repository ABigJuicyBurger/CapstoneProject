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
router.put("/meta", authenticateToken, usersController.updateMetaInfo);

/* Protected endpoint to get user details */
router.get("/userProfile", authenticateToken, usersController.getUser);

/* Get and update user meta information (Protected) - Deprecated, use /meta instead */
router.get("/user/meta", authenticateToken, usersController.getMetaInfo);
router.put("/user/meta", authenticateToken, usersController.updateMetaInfo);

export default router;
