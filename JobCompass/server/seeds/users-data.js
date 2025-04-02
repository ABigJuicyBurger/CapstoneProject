import users from "../seed-data/users.js";
import user_meta from "../seed-data/user-meta.js";

export async function seed(knex) {
  await knex("users").del();
  await knex("users").insert(users);
  await knex("user_meta").del();
  await knex("user_meta").insert(user_meta);
}
