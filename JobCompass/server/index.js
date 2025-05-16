import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';



// Import the centralized db connection
import db from "./db/connection.js";

// Import routes
import jobsRoutes from "./routes/jobsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js"

// Load environment variables
dotenv.config();

// Get environment
const environment = process.env.NODE_ENV || "development";

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Server root:', __dirname);
console.log('Uploads path:', join(__dirname, 'uploads'));

// to handle uploads
app.use("/uploads", express.static(join(__dirname, 'uploads'), {
  setHeaders: (res, path, stat) => {
    console.log('Serving file:', path);
  }}));


// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Get all jobs or individual job
app.use("/jobs", jobsRoutes);

// Get user info
app.use("/user", userRoutes);



app.use("/resumeAI", aiRoutes)

// basic route for home
app.get("/", (_req, res) => {
  res.send("Welcome!");
});

app.use((_req, res) => {
  res.status(404).send("Error, please try again or go home");
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${environment}`);
  console.log(`CORS origin: ${process.env.CORS_ORIGIN || "*"}`);
});
