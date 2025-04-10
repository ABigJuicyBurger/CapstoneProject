"here i would bring in api info";

export async function seed(knex) {
  await knex("api_jobs").insert([]);
}
