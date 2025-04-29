import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Import the centralized db connection
import db from "./db/connection.js";

// Load environment variables
dotenv.config();

// Get environment
const environment = process.env.NODE_ENV || "development";

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Import routes
import jobsRoutes from "./routes/jobsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${environment}`);
  console.log(`CORS origin: ${process.env.CORS_ORIGIN || "*"}`);
});
