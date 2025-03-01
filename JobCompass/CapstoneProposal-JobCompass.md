# Project Title

## Overview

What is your app? Give a brief description in a couple of sentences.

Job Compass is an interactive map that pinpoints locations of jobs depending on the type of job (part time, full time, contract) with a
dataset that refreshes the highlighed jobs in map to show different jobs. Think Rent Faster meets Indeed.

### Problem Space

Why is your app needed? Give any background information around any pain points or other reasons.

Indeed and Linkedin lack the interactivity that comes in job hunting - the monotony and automation may get to people who are going through
stressful times. The goal with JobCompass is to provide a bit of randomness in terms of jobs refreshing (depending on what job the user is looking
for) and a bit of fun in terms of physically seeing where they'll work so they don't have to do the extra work of finding the company on
Google Maps.

### User Profile

Who will use your app? How will they use it? Add any special considerations that your app must take into account.

Primarily users will use my app through the ability to log in, save their favorite jobs, and apply for work. A later feature for recruiters would be added if time
permits (as another feature of the app might be the job swipe option, similar to Tinder but for work, with each user having three swipes a day)

### Features

List the functionality that your app will include. These can be written as user stories or descriptions with related details. Do not describe _how_ these features are implemented, only _what_ needs to be implemented.

- As a guest, I want to be able to view the interactive map and view jobs

- As a guest, I want to be able to create an account to manage my job applications (now user)
- As a guest, I want to be able to login to my account to manage my job applications (now user)

- As a user, I want to be able to apply for a job with a resume attachment.
- As a user, I want to be able to save jobs through the map.

- As a user, I want to be able to filter jobs on job type (FT, PT, Casual), and search for specific jobs

## Implementation

### Tech Stack

List technologies that will be used in your app, including any libraries to save time or provide more functionality. Be sure to research any potential limitations.

- React
- TypeScript (maybe)
- MySQL / Knex
- Express/Node JS
- Client libraries:
  - react
  - react-router
  - axios

### APIs

List any external sources of data that will be used in your app.

No API's for now; though I'd use one like Adzena but I decided I'd stick to 100-200 jobs on a backend server which will be quick (repetitive) for a list of generic jobs;
couldn't find anything I didn't have to pay for API wise for job listings.

### Sitemap

List the pages of your app with brief descriptions. You can show this visually, or write it out.

- Home Page
- Login/Register
- Map Page with nav bar for searching work + places (disabled for now, sticking with Calgary only)
- Multi-sectioned page which will have search bar with jobs below it on one side, map on the other, covering the site (mobile fill have option to toggle)

### Mockups

Provide visuals of your app's screens. You can use pictures of hand-drawn sketches, or wireframing tools like Figma.

### Data

Describe your data and the relationships between the data points. You can show this visually using diagrams, or write it out.

### Endpoints

List endpoints that your server will implement, including HTTP methods, parameters, and example responses.

## Roadmap

Scope your project as a sprint. Break down the tasks that will need to be completed and map out timeframes for implementation working back from the capstone due date.

- Create client

  - react project with routes and boilerplate pages

- Create server
  - express project with routing, with placeholder 200 responses

---

## Future Implementations

Your project will be marked based on what you committed to in the above document. Here, you can list any additional features you may complete after the MVP of your application is built, or if you have extra time before the Capstone due date.
