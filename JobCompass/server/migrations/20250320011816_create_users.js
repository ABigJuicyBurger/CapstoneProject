/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export function up(knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id"); // Primary key
      table.string("username").notNullable().unique();
      table.string("email").notNullable().unique();
      table.string("password_hash").notNullable();
      table.string("avatar");
      table.timestamps(true, true); // created_at & updated_at
    })
    .createTable("user_meta", (table) => {
      table.increments("id"); // Primary key
      table.integer("user_id").unsigned().notNullable().unique();
      table.text("bio"); // Short description of your experience
      table.string("resume");
      table.json("savedjobs");
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("user_meta").dropTable("users");
}
