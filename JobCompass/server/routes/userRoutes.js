import express from "express";
import multer from "multer";
import path from "path";

import * as usersController from "../controllers/users-controller.js";
import authenticateToken from "../middleware/AuthToken.js";
// Import the centralized db connection instead of creating a new one
import db from "../db/connection.js";

const router = express.Router();

// Remove this line - don't create a new Knex instance here
// const knex = initKnex(configuration);

// multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // physical directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("PDF files only please"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // or 5MB
  },
}); //multer middleware

/* login route */
router.post("/login", usersController.login);

/* register route */
router.post("/register", usersController.register);

/* Get meta info of user (Protected) */
router.get("/meta", authenticateToken, usersController.getMetaInfo);
router.put(
  "/meta",
  authenticateToken,
  upload.single("resume"),
  usersController.updateMetaInfo
);
// router.post("/meta", authenticateToken, usersController.updateMetaInfo);

/* Protected endpoint to get user details */
router.get("/userProfile", authenticateToken, usersController.getUser);

/* Get and update user meta information (Protected) - Deprecated, use /meta instead */
router.get("/user/meta", authenticateToken, usersController.getMetaInfo);
router.put("/user/meta", authenticateToken, usersController.updateMetaInfo);

export default router;
