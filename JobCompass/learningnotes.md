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

  March 05

- we got jobs: now let's start the front end
  \_ play around with google maps
  \_ Get api key from site (https://visgl.github.io/react-google-maps/docs/get-started)
  \_ Map is functional and shows on page centerd in calgary with a bit of space around it to showw the job card selected
  \*\*\*\* Need to show job markers eventually w/ basic tooltips (AI HELPED HERE)

  March 06
  \_ return data with axios request; now i need to form a job card (tomorrow me)

  march 08
  \_ start with a job card and see how it looks!
  \_ looks horrible! but all data is successfuly sent so just need to style ( :)

  March 10

  - do a little job card styling during learning studio
    \_ install date-fns and use it to format date from disgusting ISP 8601
    \_ little job card styling done! \*\*\*\ still need some logic like saving + apply, will look at once done job list
  - job list done! for last hour of day will incorporate a bit of TS
    \_ npm i -g typescript
    \_ create tsconfig file w/ tsc --init
    \_ create a type object for jobCard with its shape
    \_ use it where needed in the state "storage", mention what im returning JSX,
    mention what other status should return, mention what methods are returning,
    and adjust tsconfig to return JSX.
    - Will learn to type as i go
    - to prevent complications let me summarize:
      \_ created type definition modeling shape of job data
      \_ defined types for properties of this job
      \_ exported it
      \_ imported it to jobcard and added return type to component (JSX.Element)
      \_ type state hooks with generics (<JobCardType | null> and <Boolean>)
      \_ added promise return type to async fnxn (: Promise<void>)
      \_ : is annotate type and <> is generic type (definite type vs conditional type)
  - for now let's create a job list container which can link to particular job
    \_ practiced types in joblist too, had to import JSX + npm i types/react
    in order for TS to find namespace JSX
    \_ and made an interface for .env so TS understands Vite
  -

March 12

- got the okay for capstone + completed capstone proposal
- lost .env files when switching branches! made a new one and locally saved it this time
- Leaked the api key! went through a coaster using bfg repo-cleaner and java to remove all instances of it in github + rotated apikey to prevent someone snatching it and using it
  \_ creater mirror cloen with a replacement txt file, ran BFG w/ Java to find+replace data in commit history, used git reflog and gc to clean up referencees
- Next, typed the home page and fixed API key by importing starting with VITE
  \_ now im conditionally rendering baseed on screen size: everything after mobile shows the map/list function
- Now i need to show the map (success) with advanced markers (of each job) with corresponding pin
  \_ first i need to set a map id (google api requirement, represents styling and configs i have)

March 13

- Styled maps with maps api
- show a single card through user click on marker (which i need to style) by saving click in a state var and conditionally rendering the mapcard or an extension of jobcard which accepts a prop which changes url path (where default is just the browser search of url which uses params)
  \_ wow that was wordy

March 15

- Positioned Job Card within the map with absolute positioning and z index
- added restriction bounds within the map to restrict map movement to anything outside of calgary

March 17

- Make URL show up in jobcard; this is neeede in job map (as card shows conditionally in the map)
  by using navigate
- Adjust type of props being passed from Map -> card -> note (which is basically an extension of jobCard)
  \_ separate jobnote to its own component that is the "opposite" side of the card
  \_ typed note with map job card as they come together like a marriage
  \_ quickyl implemented a simple login and register component
  \*\*\* will need to clean up pages folder! as that will be my finalized product
  \_ got so stressed as passing props up causes a llot of TS issues so ihad to make sure my prop names were A correct, B being passed right and C being typed appropriately
  \_ current prop passing note flow is App.tsx -> JobMap.tsx -> MapJobCard.tsx -> JobCard.tsx &&
  App.tsx to JobNote.tsx

  - added a "under construction" page for login and register, cleaned up styling for
    main page, and added logic to conditionally render list or map on phone mode (tiny)
  - got note functionality working!

  March 19

  - today i will focus on mobile styling where its eitheer map or joblist; can't do both!
    \_ cleaned up jobcard so its on the sidee past mobile screens and at the bottom in mobile mode
  - added logic to check mobile size with window event listener with 'resize'; if it crosses mobile size
    then some styling changes occur including button that shows up in header to toggle between map or job
  - cleaned up pathway so that individual jobs show on mobile state as well
  - NOW i need to focus on marker API styling (on load show job; hover show company and salary)
    \*\*\* priority is computer over mobile

  March 20

  - today im using a state var to check if im hovering on job; if i am ill use the hovered id to match the marker selected and style it
    \_ only fancy thing used is in job map i have to check if its hovered and if the id matches the hovered id
  - I also crossed out anything not done yet (crudding users and the saved jobs; saved jobs may take priority now)
  - for now ill clean up my folders and ill also start a saved jobs route: for guest mode.
    \_ have a guest user on click immediately that gets wiped out on tab close (maybe a cookie?)

  - tonight maybe try the "roulette" state where i show 10 jobs at first, and every 6-10 seconds i add a new job and every 8-12 seconds i delete a job to emulate a "live" server
    \_ or maybe, for fun....
    -i shouldn't "surprise" the user; they want a clean UX with consistency and not really gamify it

  March 21

  - Today I'll focus on deployment so i Have a live app that can be accessible!
    \_ will use AWS EC2
    \_ create a budget
    \_ ubuntu server
    \_ start ~/.ssh to save key locally
    \_ grab the Ipv4 from my instance

    -log into the EC2 instance with SSH
    \_ $ cd ~/.ssh
    Then, execute the following command:
    $ ssh -i <PEM_FILE_NAME> ubuntu@<SERVER_IPV4_ADDRESS>

    - connected!

    * curl already installed
    * install node :
      \_ curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh (setup script)
      \_ sudo -E bash nodesource_setup.sh (run script)
      \_ sudo apt-get install -y nodejs (install node)
      - verify with node -v
    * install PM2, process manager to keep node running
      \_ $ sudo npm i -g pm2
    * setup github ssh to transfer files over to EC2
      \_ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
      \_ with that cat ~/.ssh/id_rsa.pub
      \_ send it over to github and add it
      \_ now ssh -T git@github.com to verify
      = Connected!
    * folder on EC2 to store app files
      \_ mkdir ~/repos
      clone my repo from git -> npm i both client & server
      - npm i both ends and run production version with npm run build on front end
      - started express server w/ pm2 start index.js and pm2 save && pm2 startup to start on reboot
    * now to create .env (need to be safe)
      \_ nano .env
      \_ put backend info first
    * now to set up frotn end
    * first use nginx so that it serves my front end appropriately and protect my backend port
      \_ sudo apt update && sudo apt install nginx
      \_ check if successful: systemctl status nginx
      \_ instead of editing the default Nginx config, create a separte config file
      = sudo nano /etc/nginx/sites-available/jobcompass
      \_ add our config =
      = server {
      listen 80;
      server_name your-ec2-ip-address;

          # Serve frontend static files
          location / {
              root /home/ubuntu/repos/JobCompass/client/dist;
              try_files $uri $uri/ /index.html;
              index index.html;
          }

          # Forward API requests to Express backend
          location /jobs {
              proxy_pass http://localhost:8080;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
          }

      }

  - then ctrl o (save) -> enter -> ctrl x
  - now enable my config as it's not the default!
    \_ sudo ln -s /etc/nginx/sites-available/jobcompass /etc/nginx/sites-enabled/
    \_ sudo rm /etc/nginx/sites-enabled/default # Remove default config
  - now test if it works: sudo nginx -t
  - then restart

  - now set up front end .env slightly differently usign the ec2 instance
    \_ VITE_BACKEND_URL=http://your-ec2-ip-address
    VITE_GOOGLE_MAPS_API_KEY=your-maps-api-key

  - finally run npm run build

  - and launch! didnt work
  - nginx doesnt have permission to access front end.
    (AI HELP)

    - # Make sure the dist directory exists
      ls -la dist### First-Time Deployment:

    1. **Server Prerequisites**:

    - SSH into EC2: `ssh -i <PEM_FILE> ubuntu@<IP_ADDRESS>`
    - Install Node.js:
      ```bash
      curl -fsSL https://deb.nodesource.com/setup_23.x | sudo -E bash -
      sudo apt install -y nodejs
      ```
    - Install PM2: `sudo npm i -g pm2`
    - Install MySQL: `sudo apt install mysql-server`
    - Install Nginx: `sudo apt install nginx`

    2. **MySQL Setup**:

    - Start MySQL: `sudo systemctl start mysql`
    - Configure MySQL:
      ```bash
      sudo mysql
      CREATE DATABASE jobcompass_jobslist;
      ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your password';
      GRANT ALL PRIVILEGES ON jobcompass_jobslist.* TO 'root'@'localhost';
      FLUSH PRIVILEGES;
      EXIT;
      ```

    3. **Clone Project**:

    - `mkdir ~/repos && cd ~/repos`
    - `git clone <your-repository-url>`
    - `cd JobCompass`

    4. **Backend Setup**:

    - `cd server && npm install`
    - Create .env file:
      ```
      PORT=**####**
      DB_HOST=####
      DB_NAME=your DB name
      DB_USER=your username
      DB_PASSWORD=your password
      CORS_ORIGIN=*
      ```
    - Set up database:
      ```bash
      npx knex migrate:latest
      npx knex seed:run
      ```
    - Start server: `pm2 start index.js && pm2 save`

    5. **Frontend Setup**:

    - `cd ../client && npm install`
    - Create .env file:
      ```
      VITE_BACKEND_URL=http://<your-ec2-ip>
      VITE_GOOGLE_MAPS_API_KEY=<your-api-key>
      ```
    - Build: `npm run build`

    6. **Nginx Configuration**:

    - Create config: `sudo nano /etc/nginx/sites-available/jobcompass`

      ```
      server {
        listen 80;
        server_name <your-ec2-ip>;

        location / {
            root /var/www/jobcompass;
            try_files $uri $uri/ /index.html;
            index index.html;
        }

        location /jobs {
            proxy_pass http://localhost:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
      }
      ```

    - Enable site:
      ```bash
      sudo mkdir -p /var/www/jobcompass
      sudo ln -s /etc/nginx/sites-available/jobcompass /etc/nginx/sites-enabled/
      sudo rm /etc/nginx/sites-enabled/default
      sudo cp -R ~/repos/JobCompass/client/dist/* /var/www/jobcompass/
      sudo nginx -t
      sudo systemctl restart nginx
      ```

    ````

    # Updating Existing Deployment

    ```markdown
    ### When Deploying Updates:

    1. **Pull Changes**:
      ```bash
      cd ~/repos/JobCompass
      git pull origin main
    ````

    2. **Update Backend** (if needed):

    ```bash
    cd server
    npm install  # Only if package.json changed

    # Only if you added database migrations:
    npx knex migrate:latest

    # Only if you need to update seed data (caution: may overwrite existing data):
    npx knex seed:run

    # Restart server:
    pm2 restart all
    ```

    3. **Update Frontend**:

    ````bash
    cd ../client
    npm install  # Only if package.json changed
    npm run build
    sudo rm -rf /var/www/jobcompass/*
    sudo cp -R dist/* /var/www/jobcompass/

    # Set proper permissions
    sudo chown -R www-data:www-data /var/www/jobcompass

    # Restart Nginx (optional, but good practice)
    sudo systemctl restart nginx ```

    ````

    ## Troubleshooting Common Issues

    ```markdown
    ### Common Issues:

    1. **"MySQL Connection Refused"**:

    - Check if MySQL is running: `sudo systemctl status mysql`
    - If not running: `sudo systemctl start mysql`
    - Verify credentials in .env match what you set up

    2. **Build Permission Errors**:

    - Fix ownership: `sudo chown -R ubuntu:ubuntu ~/repos/JobCompass/client/dist`

    3. **"404 Not Found" on Frontend**:

    - Check Nginx config: `sudo nginx -t`
    - Verify files were copied: `ls -la /var/www/jobcompass/`

    4. **Missing Images/Assets**:

    - Use relative paths in production:
      - Import directly: `import logo from '../../assets/logo.png'`
      - Or use public folder: `src="/assets/logo.png"` (and place in public folder)

    5. **500 Server Errors**:

    - Check PM2 logs: `pm2 logs`
    - Verify database connection in server logs

    6. **CORS Issues**:

    - Ensure CORS_ORIGIN doesn't have trailing slashes
    - For development, use: `CORS_ORIGIN=*`

    7. **Quick Verification Steps**:

    - Test API: `curl http://localhost:8080/jobs`
    - Check server: `pm2 status`
    - Check web server: `systemctl status nginx`
    ```

  - hefty but done.

  - before that, http://jobcompass.duckdns.org/ sounds better than http://15.156.83.137/
  - this is using duckdns

  - now ill start a new feature: a user

  March 22 (potentially final day):

  - for practice ill seet up the DB with the route anyways for users
  - for guest maybe just have a local user with their state as is?

  March 25

  - set up guest user
    \_ with a state variable, set a guest object and have it live in app
    \_ now push it to the saved jobs page

  March 26

  - so guest user is set up and is routed to saved jobs
  - Link from header takes to guest saved, or user saved and changes URL
  - next is to route the job card save button to save the title of the job; links to the job card

POST BOOTCAMP
March 31

- used local storage and some state management to have a guest job saving feature (including notes!)
- now will have a deployment script so i dont run the commands above in the EC2 all the time
- finally nano'd a deployment script that prints commands to check if package json changed to reinstall it; then do all those commands and make it executable

Now all I need to do is:
**git pull origin main then**
**~/deploy-frontend.sh**

April 02

- start setting up a users DB; focus on backend today
  \_ set up proper migrations. start with a test user to make sure all is safe, then focus on registering new users
  \_ created a proper DB structure
  \_ installed bcrypt & jsonwebtoken

- set up the seed-data
  \_ users and user meta have the appropriate beginning strcuture and have been imported to the seed
- ran seed and the "test" user seed is now implemented

- now create auth routes, generate JWT< protect route w/ middleware, then test
  \_ add secret key to env, install dotenv to configure, and bcrypt to salt the seed data
  ** Create function to auth the token against my secret key **
  \_ now in middleware folder

  April 03
  \_ finished setting up middleware to verify JWT token; user controller for login and password verify; routes for proper endpoints; and index to mount user

  - now focus on frontend to ensure flow of authentication works
    \_ useEffect to track user login throughout app browse

  - complete login in the front end
    \_ have logic to handlelogin which saves token in localstorage and change state var
    \_ logic to handlelog out which resets all state variables

  - create form to collect login info
    \_ name matches password_hash, render conditionally

  - Auth state in App
    \_ state management for auth; store login status in state var, check existing JWT, conditionally render
    \_ localstorage to persist auth between sessions
    \_ let app use usenavigate by moving browser router above
    \_ fixed types for API connection

    \_ vibe code....
    \_ now there is a user registration adn login (using bcrypt and JWT), some tests to check if form data is valid for registering, UI to show a profile page as well as save jobs and update bio

  Done!

  Apr 7 2025
  \_ start a location search bar LATER
  \_ before that, fixed proper url naming and job saving bug in individual card

  - next, update header
    \_ logic to show a taskbar, separated to its own component
    \_ cleaned up header button and prover navigation

  \_ now focus on having real jobs through Active Jobs DB API

  - Free tier but limited API Calls
  - which means a simple job fetching script
    \_ use JobsDB API

    - (AI helped provide the right API call as I had a space in my API env and had the dynaic route before causing error in api call)
    - got the data, have a simple caching system so i dont use up all api calls

    okay
    now i need to cache locally (on myDB) as well as the EC2 server.
    \_ with local, start with knex

    - tomorrow add a cached at timestamp with knex, then modify service.js to fetch data and store in DB or to check cahced jobs and store api results in DB, update controller to handle DB

  - Apr 14 2025
    - clea up path of header for guest saved jobs
  - Today, tiem to add a caching system to store jobs
    \_ caching successful!

  finally the frontend

  Apr 18 2025
  \_ start button apply

  Apr 21 2025
  -\_ try to fix the repetitive render of each marker on hover
  \_ i give up, focused on resume upload. this required
  a post request but backend needs multer for form data
  being uploaded
