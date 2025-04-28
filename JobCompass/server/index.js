import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import jobsRoutes from "./routes/jobsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const { PORT, CORS_ORIGIN } = process.env;

console.log("Environment variables loaded:", { PORT, CORS_ORIGIN });

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

// to handle uploads
app.use("/uploads", express.static("uploads"));

// basic route for home
app.get("/", (_req, res) => {
  res.send("Welcome!");
});

// Use a default port if not specified in .env
const port = PORT || 8080;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
