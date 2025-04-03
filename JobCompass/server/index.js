import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import jobsRoutes from "./routes/jobsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import authenticateToken from "./middleware/AuthToken.js";

const app = express();
const { PORT, CORS_ORIGIN } = process.env;
dotenv.config();

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);
app.use(express.json()); // body parser
app.use(express.static("public")); // serves static files

/* Custom Middleware to verify JWT Token */

// Get all jobs or individual job
app.use("/jobs", jobsRoutes);

// Get user info
app.use("/user", userRoutes);

// basic route for home
app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.get("/debug", (req, res) => {
  res.json({
    message: "Server is running",
    env: {
      hasJwtSecret: !!process.env.JWT_SECRET_KEY,
      port: process.env.PORT,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Now runnin at http://localhost:${PORT}`);
});
