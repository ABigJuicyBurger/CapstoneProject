import knex from "knex";
import config from "../knexfile.js";

// Get environment
const environment = process.env.NODE_ENV || "development";
console.log(`Using database environment: ${environment}`);

// Initialize knex with the appropriate configuration
const db = knex(config[environment]);

// Log successful connection
db.raw("SELECT 1")
  .then(() => {
    console.log(`Database connected in ${environment} mode`);
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    throw err; // Re-throw to fail the connection
  });

export default db;
