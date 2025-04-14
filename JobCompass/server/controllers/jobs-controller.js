import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import jobApiService from "../services/jobApiService.js";

const getJobs = async (_req, res) => {
  // always need async here
  // sync: all at the same time top to bottom fast
  try {
    const jobsData = await knex("jobs");
    res.status(200).json(jobsData);
  } catch (err) {
    res.status(400).json({
      message: `Could not get jobs list, ${err.message}`,
    });
  }
};

const singleJob = async (req, res) => {
  try {
    // get the id from the request of the server
    const { id } = req.params;
    const job = await knex("jobs").where({ id }).first();
    // const jobData = job[0];
    res.status(200).json(job);
  } catch (err) {
    res.status(400).json({
      message: `Could not fetch job, ${err.message}`,
    });
  }
};

const getJobsfromAPI = async (req, res) => {
  try {
    // Check if location is in route params or query params
    const location = req.params.location || req.query.location || "Calgary"; // Default to Calgary if no location provided

    const jobs = await jobApiService.fetchJobsfromAPI(location);
    console.log(`Returning ${jobs.length} jobs to client`);

    res.json(jobs);
  } catch (error) {
    console.error("Error in getJobsfromAPI controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getSingleApiJob = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching API job with ID: ${id}`);

    // Query the api_jobs table for the job with this ID
    const job = await knex("api_jobs").where({ id }).first();

    if (!job) {
      return res
        .status(404)
        .json({ message: `API job with ID ${id} not found` });
    }

    // Parse the skills JSON string back to an array
    if (job.skills && typeof job.skills === "string") {
      try {
        job.skills = JSON.parse(job.skills);
      } catch (e) {
        console.error(`Error parsing skills for job ${id}:`, e);
        job.skills = [];
      }
    }

    // Format the job description for better readability
    if (job.description) {
      // Format common section headers with line breaks
      const formattedDescription = job.description
        // Add line breaks before common section headers
        .replace(
          /([.!?])\s*(About|Company Description|Job Description|Qualifications|Requirements|Responsibilities|What you'll do|What you bring|Why Join|Additional Information)/g,
          "$1\n\n$2"
        )
        // Add line breaks after colons in headers
        .replace(/(:\s*)/g, "$1\n")
        // Add line breaks before bullet points (often indicated by dashes or asterisks)
        .replace(/([.!?])\s*(-|\*|\d+\.)/g, "$1\n\n$2")
        // Add line breaks for paragraphs
        .replace(/([.!?])\s+([A-Z])/g, "$1\n\n$2")
        // Replace multiple consecutive line breaks with just two
        .replace(/\n{3,}/g, "\n\n");

      job.description = formattedDescription;
    }

    // Also format requirements field if it exists
    if (job.requirements) {
      const formattedRequirements = job.requirements
        // Add line breaks before bullet points or numbered items
        .replace(/([.!?])\s*(-|\*|\d+\.)/g, "$1\n\n$2")
        // Add line breaks for paragraphs
        .replace(/([.!?])\s+([A-Z])/g, "$1\n\n$2")
        // Replace multiple consecutive line breaks with just two
        .replace(/\n{3,}/g, "\n\n");

      job.requirements = formattedRequirements;
    }

    res.status(200).json(job);
  } catch (err) {
    console.error(`Error fetching API job: ${err.message}`);
    res.status(500).json({
      message: `Could not fetch API job, ${err.message}`,
    });
  }
};

export { getJobs, singleJob, getJobsfromAPI, getSingleApiJob };
