import express from "express";
import multer from "multer";
import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';


import * as usersController from "../controllers/users-controller.js";
import authenticateToken from "../middleware/AuthToken.js";


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = join(__dirname, 'uploads');
const resumeDir = join(uploadDir, 'resumes');

console.log('Upload directory:', uploadDir);
console.log('Resume directory:', resumeDir);


if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}
if (!existsSync(resumeDir)) {
  mkdirSync(resumeDir)
}

// multer for file uploads
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumeDir); // physical directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
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

export default router;
