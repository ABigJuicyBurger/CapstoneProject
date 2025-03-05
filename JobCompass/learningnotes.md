Mar 1

- Set up react + dependencies
  \_ create vite @ latest -- --template react
  \_ npm init y (redundant due to ^)
  \_ npm install axios cors dotenv express knex mysql2 react-router-dom sass

  - setup basic browser router, routes, route

- Help create DB

  - look at @joblistcreation.sql (connect to DB, create DB, then npx knex init)
    \_switch default file to export module with mysql2 connection and the payload (knexfile.js)

  - create migration file
    \_npx knex migrate:make create_job_postings

    - up: create ; down: delete
    - edit migration file (check migrations folder)
      \_ now contains relevant job info

  - create tables!
    \_ npx knex migrate:latest (like up)

    - to drop: npx knex migrate:rollback

  - seed data
    \_ npx knex seed:make jobs-data (makes seeds folder)
    \_ in seeds folder import the data and just use DB name
    \_ make folder name of seed-data and put the imported data in export default file

  Mar 03

  - execute seed files and add to DB
    \_ npx knex seed:run
    \_ lets script some of these codes:

    - "migrate": "knex migrate:latest",
    - "migrate:down": "knex migrate:down",
    - "migrate:rollback": "knex migrate:rollback",
    - "seed": "knex seed:run"
      \_ also install nodemon to watch for changes

  - DB stuff done! Now some basic routing and querying with Express
    \_ set up index.js file with .env, express and instantiate it with port
    \_ run it with node index.js
    - tomorrow set up a route and create it; initKnex config and fetch that data :0

March 04

- Route setting
  \_ imported initknex and configuration
  \_ make an instancee of knex with initknex(config)
  \_ setup route for jobs and link to jobsroutes
  \_ jobsroutes has router using express and gets a route and uses controller
  \_ the controller does stuff (like handle requests)
