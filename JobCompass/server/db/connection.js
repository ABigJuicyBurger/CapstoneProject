import knex from "knex";
import knexConfig from "../knexfile.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize knex with the correct environment
const environment = process.env.NODE_ENV || "development";
console.log(`Using database environment: ${environment}`);

// Make sure knexConfig[environment] exists
if (!knexConfig[environment]) {
  console.error(`No configuration found for environment: ${environment}`);
  console.error("Available configurations:", Object.keys(knexConfig));
  throw new Error(
    `Missing database configuration for environment: ${environment}`
  );
}

const db = knex(knexConfig[environment]);
console.log(`Database connected in ${environment} mode`);

export default db;
