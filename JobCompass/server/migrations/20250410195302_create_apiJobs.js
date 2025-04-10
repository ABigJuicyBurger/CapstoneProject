/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("api-jobs", (table) => {
    // Primary ID
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("company").notNullable();

    // Details
    table.text("description");
    table.string("type").notNullable(); // full time, part time
    table.string("salary_range");

    // location
    table.string("address").notNullable();
    table.decimal("latitude", 10, 8).notNullable();
    table.decimal("longitude", 11, 8).notNullable();

    // optional
    table.string("company_logo_url");
    table.text("requirements");
    table.json("skills");

    // timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("api-jobs");
}
