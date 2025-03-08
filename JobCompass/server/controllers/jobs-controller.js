import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

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
    res.status(200).json(job);
  } catch (err) {
    res.status(400).json({
      message: `Could not fetch job, ${err.message}`,
    });
  }
};

export { getJobs, singleJob };
