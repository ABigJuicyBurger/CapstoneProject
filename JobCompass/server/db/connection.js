import knex from "knex";
import knexConfig from "../knexfile.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize knex with the correct environment
const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

console.log(`Database connected in ${environment} mode`);

export default db;