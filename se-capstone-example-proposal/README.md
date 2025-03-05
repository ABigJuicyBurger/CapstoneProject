# Project Title
Good* Coffee

## Overview

Good* Coffee is a place for third-wave coffee enthusiasts to find and keep track of the best cafés.

### Problem

Third-wave coffee is coffee made with high-quality beans typically sourced from individual farms and roasted more lightly to bring out their distinctive flavors. There is no certain way to know the quality of a café's coffee before purchasing and having your first sip. When looking for a third-wave café in a given area, people generally have to go through the time-consuming process of doing a Google search for coffee near a location then manually analyze images, reviews, etc. for each café before deciding if it might be a café serving a high-quality cup of third-wave coffee.

### User Profile

- Coffee drinkers:
    - looking for a café close to their current location
    - looking for a café close to a given location for the future
    - that want to keep track of the cafés they've tried

### Features

- As a user, I want to be able to find the closest café close to my current location
- As a user, I want to be able to find the closest café close to any given location
- As a user, I want to be able to find the highest-rated café within a certain distance from any given location

- As a user, I want to be able to create an account to manage my visited cafés
- As a user, I want to be able to login to my account to manage my visited cafés

- As a logged in user, I want to be able to rate a visited café out of 5 coffee cups
- As a logged in user, I want to be able to update a rating of a café out of 5 coffee cups
- As a logged in user, I want to be able to see my visited cafés
- As a logged in user, I want to be able to filter my visited cafés by location

## Implementation

### Tech Stack

- React
- TypeScript
- MySQL
- Express
- Client libraries: 
    - react
    - react-router
    - axios
- Server libraries:
    - knex
    - express
    - bcrypt for password hashing

### APIs

- No external APIs will be used for the first sprint

### Sitemap

- Home page
- List cafés
- View + Rate a café
- Register
- Login

### Mockups

#### Home Page
![](home.png)

#### Register Page
![](register.png)

#### Login Page
![](login.png)

#### Enter Location Page
![](enter-location.png)

#### View Cafés Page
![](view-cafes.png)

#### View Café Page
![](view-cafe.png)

#### View Café Page (Rated state)
![](view-cafe-rated.png)


### Data

![](sql-diagram.png)

### Endpoints

**GET /cafes**

- Get cafés, with an optional "visited" if the user is logged in or not

Parameters:
- longitude: User-provided location as a number
- latitude: User-provided location as a number
- token (optional): JWT used to add "visited" boolean


Response:
```
[
    {
        "id": 1,
        "name": "Quantum Coffee",
        "distance": 0.25,
        "averageRating": 4.5,
        "visited": true
    },
    ...
]
```

**GET /cafes/:id**

- Get café by id, with an optional "userRating" if the user is logged in or not

Parameters:
- id: Café id as number
- token (optional):  JWT used to add user rating

Response:
```
{
    "id": 1,
    "name": "Quantum Coffee",
    "distance": 0.25,
    "averageRating": 4.5,
    "userRating": 5
}
```

**POST /cafes/:id/rating**

- Logged in user can add their rating of a café

Parameters:
- id: Café id
- token: JWT of the logged in user
- rating: Number Rating out of 5 in 0.5 increments

Response:
```
{
    "id": 1,
    "name": "Quantum Coffee",
    "distance": 0.25,
    "averageRating": 4.5,
    "userRating": 5
}
```

**PUT /cafes/:id/rating**

- Logged in user can update their rating of a café

Parameters:
- id: Café id
- token: JWT of the logged in user
- rating: Number Rating out of 5 in 0.5 increments

Response:
```
{
    "id": 1,
    "name": "Quantum Coffee",
    "distance": 0.25,
    "averageRating": 4.5,
    "userRating": 5
}
```

**POST /users/register**

- Add a user account

Parameters:

- email: User's email
- password: User's provided password

Response:
```
{
    "token": "seyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6I..."
}
```

**POST /users/login**

- Login a user

Parameters:
- email: User's email
- password: User's provided password

Response:
```
{
    "token": "seyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6I..."
}
```

### Auth

- JWT auth
    - Before adding auth, all API requests will be using a fake user with id 1
    - Added after core features have first been implemented
    - Store JWT in localStorage, remove when a user logs out
    - Add states for logged in showing different UI in places listed in mockups

## Roadmap

- Create client
    - react project with routes and boilerplate pages

- Create server
    - express project with routing, with placeholder 200 responses

- Create migrations

- Gather 15 sample café geolocations in two different cities

- Create seeds with sample café data

- Deploy client and server projects so all commits will be reflected in production

- Feature: List cafés from a given location
    - Implement list cafés page including location form
    - Store given location in sessionStorage
    - Create GET /cafes endpoint

- Feature: View café
    - Implement view café page
    - Create GET /cafes/:id 

- Feature: Rate café
    - Add form input to view café page
    - Create POST /ratings
    - States for add & update ratings 

- Feature: Home page

- Feature: Create account
    - Implement register page + form
    - Create POST /users/register endpoint

- Feature: Login
    - Implement login page + form
    - Create POST /users/login endpoint

- Feature: Implement JWT tokens
    - Server: Update expected requests / responses on protected endpoints
    - Client: Store JWT in local storage, include JWT on axios calls

- Bug fixes

- DEMO DAY

## Nice-to-haves

- Integrate Google Places / Maps
    - View more details about a café
    - Visual radius functionality
- Forgot password functionality
- Ability to add a café 
- Elite status badging for users and cafés: Gamify user ratings
- Expand rating system
    - Coffee
    - Ambiance
    - Staff
- Expanded user information: full name, favorite café
- Unit and Integration Tests