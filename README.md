# Project Title
FORTUNE HOUSE

## Overview
a website designed to help users gain insights into themselves through detailed descriptions based on their date of birth (and location). By generating a personalized chart using the Four Pillars of Destiny, users can reflect on their character, influences, and potential life trajectory.


### Problem
In today's fast+paced world, people seek quick, accessible ways to gain personal insights and guidance. Traditional fortune+telling methods are often time+consuming or geographically limited. Fortune+Tellers addresses this by offering immediate, personalized insights into various life aspects, including relationships, career, and personal growth, through a digital platform accessible anytime, anywhere.


### User Profile
+ Individuals interested in self+reflection and personal growth
+ Users seeking guidance on life decisions
+ People curious about Eastern philosophy and fortune+telling methods


### Features
+ Personalized fortune+telling based on birth date, time, and location.
- Daily fortune cookies.
+ Users can create and manage their accounts to keep track of their daily fortune.
+ Mobile+responsive design.

All you need is your intuition and focus, and a couple of taps or mouse clicks. Whether you are doing this just for fun or choose to believe in the high magic – ENJOY!

## Implementation
### Tech Stack
+ React
+ SASS
+ MySQL 
+ Express
+ Client libraries: 
    + react
    + react+router
    + axios
+ Server libraries:
    + knex (firebase)
    + express


### APIs
+ OpenWeatherMap API for location+based weather data https://openweathermap.org/api
- Google Calendar API convert to lunar calanders


### Sitemap
+ register
+ login
+ home page /personal page (forturn cookies )
+ Bazi calculator page
+ Result Page

### Mockups
#### Register Page
![Image]([register.jpeg](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/login.jpeg))

#### Login Page
![Image]([login.jpeg](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/register.jpeg))

#### Home Page/ Personal Page 
![Image]([home.jpeg](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/home.jpeg))

#### Bazi Calculator Page
![Image]([form.jpeg](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/form.jpeg))

#### View Result Page
![Image]([result.jpeg](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/result.jpeg))
![Image]([result-popup.jpeg](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/result-popup.jpeg))

### Data
+ User data: Encrypted storage of personal information
+ Fortune data: Database of 60 Jia+Zi characteristics and corresponding suggestions


### Endpoints

**POST /user/register**
+ Logged in to start

Parameters:
+ email: User's email
+ user+name: User's email name
+ password: User's provided password

Response:
```
{
    "token": "xxx.xxx.xxx"
}
```

**POST /users/login**

+ Login a user

Parameters:
+ email: User's email
+ password: User's provided password

Response:
```
{
     "token": "xxx.xxx.xxx"
}
```

**GET /user/:id/fortune+tell**

+ Get fortune+tell data by submitting user's date of birth

Parameters:
+ name: user_name
+ day: user.birth_day,
+ month: user.birth_month,
+ year: user.birth_year,

Response:
```
{
    "id": int,
    "jia+zi": "Example Jia+Zi",
    "luckyColor": "Example Color",
    "suggestion": "Example Suggestion"
}
```

### Auth
Implement JWT authentication for secure access to user data.
Store JWT in localStorage and remove it upon logout.

## Roadmap

+ Create Client
Set up React project with routes and boilerplate pages.

+ Create Server
Set up Express project with routing and placeholder 
responses.

+ Create Migrations
Define database schema and seed initial data.

+ Implement Features
    + Fortune+Telling: Implement calculation and display of fortune+telling data.
    + User Management: Implement user registration, login, and profile management.

+ Integrate APIs
Connect with Weather, and Calendar APIs.

+ Deploy Projects
Deploy client and server projects to reflect commits in production.

+ Bug Fixes
Address any issues that arise during development and testing.

+ Implement responsive ui design
Add animations and transitions
Conduct usability testing and gather feedback
update readme.md

+ DEMO DAY


## Nice+to+haves

- create an real time chat board to talk to the fortune teller (socket.io)

- Enhanced Suggestions: 
Provide more detailed suggestions split by season.

- True Solar Time: 
Incorporate true solar time for more accurate calculations.

- Element Percentage: 
Calculate and display the percentage of each element in the user's chart.

- daily lucky cookie

- UI toggle button:
Display different UI states for day and night, or give it a toggle button.

- Google Calendar API update to integrate fortune reminders 

- Integration with social media for sharing fortunes

- offer online chat window service (scoket.io)

- show which celebrity share s birthday with u?




