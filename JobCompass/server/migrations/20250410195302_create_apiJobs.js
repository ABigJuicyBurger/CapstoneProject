/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("api_jobs", (table) => {
    // Primary ID
    table.string("id").primary();
    table.string("title", 500).notNullable();
    table.string("company", 500).notNullable();

    // Details
    table.longText("description");
    table.string("type").notNullable(); // full time, part time
    table.string("salary_range");

    // location
    table.string("address");
    table.string("location").notNullable();
    table.decimal("latitude", 10, 8);
    table.decimal("longitude", 11, 8);

    // optional
    table.string("company_logo_url");
    table.text("requirements");
    table.json("skills");

    // timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.timestamp("cached_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("api_jobs");
}

/**
 * @param { import("knex").Knex } knex
 * @param { Array<Object> } transformedJobs
 * @returns { Promise<void> }
 */
export async function insertJobs(knex, transformedJobs) {
  await knex.transaction(async (trx) => {
    for (const job of transformedJobs) {
      try {
        await trx("api_jobs").insert(job);
      } catch (err) {
        console.error(`Error processing job ${job.id}:`, err.message);
      }
    }
  });
}
