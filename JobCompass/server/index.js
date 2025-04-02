import {} from "./AuthToken";
import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import jobsRoutes from "./routes/jobsRoutes.js";

import authenticateToken from "./middleware/AuthToken.js";

const app = express();
const { JWT_SECRET_KEY, PORT, CORS_ORIGIN } = process.env;
dotenv.config();

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);
app.use(express.json()); // body parser
app.use(express.static("public")); // serves static files

/* Custom Middleware to verify JWT Token */
authenticateToken();

// Get all jobs or individual job
app.use("/jobs", jobsRoutes);

// Get user info
app.use("/user", userRoutes);

// basic route for home
app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.listen(PORT, () => {
  console.log(`Now runnin at http://localhost:${PORT}`);
});
