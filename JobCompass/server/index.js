import "dotenv/config";
import express from "express";
import cors from "cors";
import jobsRoutes from "./routes/jobsRoutes.js";

const app = express();
const { PORT, CORS_ORIGIN } = process.env;

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);
app.use(express.json()); // body parser
app.use(express.static("public")); // serves static files

// Get all jobs or individual job
app.use("/jobs", jobsRoutes);

// basic route for home
app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.listen(PORT, () => {
  console.log(`Now runnin at http://localhost:${PORT}`);
});
